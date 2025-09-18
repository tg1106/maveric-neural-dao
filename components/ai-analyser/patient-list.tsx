"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Brain, Calendar, User, Stethoscope } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { AIAnalysisButton } from "./ai-analysis-button"
import { AIAnalysisDisplay } from "./ai-analysis-display"
import { createClient } from "@/lib/supabase/client"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  chief_complaint?: string
  symptoms: string[] | string
  medical_history: string[] | string
  vital_signs: any
  created_at: string
}

interface AIAnalysis {
  id: string
  analysis_text: string
  confidence_score: number
  recommendations: string[]
  created_at: string
}

interface PatientListProps {
  patients: Patient[]
  doctorId: string
}

export function PatientList({ patients, doctorId }: PatientListProps) {
  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(new Set())
  const [patientAnalyses, setPatientAnalyses] = useState<Record<string, AIAnalysis[]>>({})
  const supabase = createClient()

  useEffect(() => {
    const loadAnalyses = async () => {
      if (patients.length === 0) return

      const patientIds = patients.map((p) => p.id)
      const { data: analyses } = await supabase
        .from("ai_analyses")
        .select("*")
        .in("patient_id", patientIds)
        .order("created_at", { ascending: false })

      if (analyses) {
        const analysesMap: Record<string, AIAnalysis[]> = {}
        analyses.forEach((analysis) => {
          if (!analysesMap[analysis.patient_id]) {
            analysesMap[analysis.patient_id] = []
          }
          analysesMap[analysis.patient_id].push(analysis)
        })
        setPatientAnalyses(analysesMap)
      }
    }

    loadAnalyses()
  }, [patients, supabase])

  const togglePatient = (patientId: string) => {
    setExpandedPatients((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(patientId)) {
        newSet.delete(patientId)
      } else {
        newSet.add(patientId)
      }
      return newSet
    })
  }

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Brain className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Patients Found</h3>
          <p className="text-muted-foreground text-center">
            Add patients to your system to start generating AI-powered treatment plans.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => {
        const isExpanded = expandedPatients.has(patient.id)
        const analyses = patientAnalyses[patient.id] || []
        const latestAnalysis = analyses[0]

        return (
          <Card key={patient.id} className="border-border">
            <Collapsible open={isExpanded} onOpenChange={() => togglePatient(patient.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{patient.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Age: {patient.age}</span>
                          <span>Gender: {patient.gender}</span>
                          {patient.chief_complaint && <span>Chief Complaint: {patient.chief_complaint}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(patient.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Patient Details */}
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        {patient.chief_complaint && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Chief Complaint</h4>
                            <p className="text-muted-foreground">{patient.chief_complaint}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Current Symptoms
                          </h4>
                          <p className="text-muted-foreground">
                            {(() => {
                              if (!patient.symptoms) return "No symptoms recorded"

                              // If symptoms is already an array, use it directly
                              if (Array.isArray(patient.symptoms)) {
                                return patient.symptoms.length > 0
                                  ? patient.symptoms.join(", ")
                                  : "No symptoms recorded"
                              }

                              // If symptoms is a string, try to parse as JSON first
                              try {
                                const parsed = JSON.parse(patient.symptoms)
                                if (Array.isArray(parsed)) {
                                  return parsed.length > 0 ? parsed.join(", ") : "No symptoms recorded"
                                }
                              } catch (e) {
                                // If JSON parsing fails, treat as plain text
                              }

                              // Fallback: treat as plain text
                              return patient.symptoms || "No symptoms recorded"
                            })()}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Medical History</h4>
                          <p className="text-muted-foreground">
                            {(() => {
                              if (!patient.medical_history) return "No medical history recorded"

                              // If medical_history is already an array, use it directly
                              if (Array.isArray(patient.medical_history)) {
                                return patient.medical_history.length > 0
                                  ? patient.medical_history.join(", ")
                                  : "No medical history recorded"
                              }

                              // If medical_history is a string, try to parse as JSON first
                              try {
                                const parsed = JSON.parse(patient.medical_history)
                                if (Array.isArray(parsed)) {
                                  return parsed.length > 0 ? parsed.join(", ") : "No medical history recorded"
                                }
                              } catch (e) {
                                // If JSON parsing fails, treat as plain text
                              }

                              // Fallback: treat as plain text
                              return patient.medical_history || "No medical history recorded"
                            })()}
                          </p>
                        </div>

                        {patient.vital_signs && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Vital Signs</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {patient.vital_signs.blood_pressure && (
                                <span>BP: {patient.vital_signs.blood_pressure}</span>
                              )}
                              {patient.vital_signs.heart_rate && <span>HR: {patient.vital_signs.heart_rate} bpm</span>}
                              {patient.vital_signs.temperature && (
                                <span>Temp: {patient.vital_signs.temperature}°F</span>
                              )}
                              {patient.vital_signs.oxygen_saturation && (
                                <span>O2 Sat: {patient.vital_signs.oxygen_saturation}%</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary" />
                          AI Treatment Analysis
                        </h4>
                        <AIAnalysisButton patient={patient} doctorId={doctorId} />
                      </div>

                      {latestAnalysis ? (
                        <AIAnalysisDisplay analysis={latestAnalysis} />
                      ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                          <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No AI analysis available</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Click "Generate AI Analysis" to create treatment recommendations focused on the chief
                            complaint
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}
