"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Mail, X } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface Patient {
  id: string
  first_name: string
  last_name: string
  age: number
  gender: string
  chief_complaint: string
  current_symptoms: string[]
  medical_history: string[]
  patient_type: string
  blood_pressure: string
  heart_rate: number
  temperature: number
  oxygen_saturation: number
  created_at: string
  ai_analyses: Array<{
    id: string
    analysis_text: string
    confidence_score: number
    recommendations: string[]
    created_at: string
  }>
  medications: Array<{
    id: string
    medicine_name: string
    dosage: string
    frequency: string
  }>
}

interface Doctor {
  id: string
  first_name: string
  last_name: string
  specialization: string
  license_number: string
  hospital_affiliation: string
}

interface PatientSummaryModalProps {
  patient: Patient | null
  doctor: Doctor | null
  isOpen: boolean
  onClose: () => void
}

export function PatientSummaryModal({ patient, doctor, isOpen, onClose }: PatientSummaryModalProps) {
  if (!patient || !doctor) return null

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient,
          doctor,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${patient.first_name}_${patient.last_name}_Summary.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast.error("Failed to download PDF. Please try again.")
    }
  }

  const handleSendEmail = async () => {
    try {
      const response = await fetch("/api/send-summary-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient,
          doctor,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      toast.success("Summary sent via email successfully!")
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Failed to send email. Please try again.")
    }
  }

  const latestAnalysis = patient.ai_analyses && patient.ai_analyses.length > 0 ? patient.ai_analyses[0] : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Patient Summary - {patient.first_name} {patient.last_name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleSendEmail} className="gap-2 bg-transparent">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Patient Information</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Name:</strong> {patient.first_name} {patient.last_name}
                  </p>
                  <p>
                    <strong>Age:</strong> {patient.age} years
                  </p>
                  <p>
                    <strong>Gender:</strong> {patient.gender}
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    <Badge variant={patient.patient_type === "inpatient" ? "default" : "secondary"}>
                      {patient.patient_type}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Healthcare Provider</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Doctor:</strong> Dr. {doctor.first_name} {doctor.last_name}
                  </p>
                  <p>
                    <strong>Specialization:</strong> {doctor.specialization || "General Practice"}
                  </p>
                  <p>
                    <strong>Hospital:</strong> {doctor.hospital_affiliation || "Not specified"}
                  </p>
                  <p>
                    <strong>Date:</strong> {format(new Date(patient.created_at), "PPP")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Chief Complaint</h3>
            <p className="text-muted-foreground bg-muted/30 p-3 rounded-lg">
              {patient.chief_complaint || "No chief complaint recorded"}
            </p>
          </div>

          {/* Current Symptoms */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Current Symptoms</h3>
            {patient.current_symptoms && patient.current_symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.current_symptoms.map((symptom) => (
                  <Badge key={symptom} variant="outline">
                    {symptom}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No symptoms recorded</p>
            )}
          </div>

          {/* Vital Signs */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Blood Pressure</p>
                <p className="font-medium">{patient.blood_pressure || "Not recorded"}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Heart Rate</p>
                <p className="font-medium">{patient.heart_rate ? `${patient.heart_rate} bpm` : "Not recorded"}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="font-medium">{patient.temperature ? `${patient.temperature}°F` : "Not recorded"}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">O2 Saturation</p>
                <p className="font-medium">
                  {patient.oxygen_saturation ? `${patient.oxygen_saturation}%` : "Not recorded"}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Medical History</h3>
            {patient.medical_history && patient.medical_history.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.medical_history.map((condition) => (
                  <Badge key={condition} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No medical history recorded</p>
            )}
          </div>

          {/* Current Medications */}
          {patient.medications && patient.medications.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Current Medications</h3>
              <div className="space-y-2">
                {patient.medications.map((medication) => (
                  <div key={medication.id} className="bg-muted/30 p-3 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Medicine</p>
                        <p className="font-medium">{medication.medicine_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dosage</p>
                        <p className="font-medium">{medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Frequency</p>
                        <p className="font-medium">{medication.frequency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {latestAnalysis && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">AI Clinical Analysis</h3>
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Confidence: {Math.round(latestAnalysis.confidence_score * 100)}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Generated {format(new Date(latestAnalysis.created_at), "PPp")}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Analysis</h4>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{latestAnalysis.analysis_text}</p>
                </div>
                {latestAnalysis.recommendations && latestAnalysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {latestAnalysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Footer */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p>
              <strong>Disclaimer:</strong> This summary is for medical professional use only. All AI-generated content
              should be reviewed and validated by qualified healthcare professionals before making treatment decisions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
