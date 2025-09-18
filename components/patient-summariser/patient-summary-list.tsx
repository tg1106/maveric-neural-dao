"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Mail, Eye, Calendar, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  chief_complaint?: string
  symptoms: string
  notes: string
  created_at: string
}

interface Doctor {
  id: string
  username: string
  full_name: string
}

interface PatientSummaryListProps {
  patients: Patient[]
  doctor: Doctor | null
}

export function PatientSummaryList({ patients, doctor }: PatientSummaryListProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const handleViewSummary = (patient: Patient) => {
    alert(
      `Patient Summary for ${patient.name}\n\nChief Complaint: ${patient.chief_complaint || "Not specified"}\nSymptoms: ${patient.symptoms || "None recorded"}\nNotes: ${patient.notes || "No additional notes"}`,
    )
  }

  const handleDownloadPDF = async (patient: Patient) => {
    toast.success("PDF download feature coming soon!")
  }

  const handleSendEmail = async (patient: Patient) => {
    toast.success("Email feature coming soon!")
  }

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Patients Found</h3>
          <p className="text-muted-foreground text-center">
            Add patients to your system to start generating comprehensive summaries.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {patients.map((patient) => {
        return (
          <Card key={patient.id} className="border-border hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>Age: {patient.age}</span>
                      <span>Gender: {patient.gender}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary text-white border-transparent">
                    Ready for Summary
                  </Badge>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(patient.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Patient Overview */}
                <div className="grid grid-cols-1 gap-4">
                  {patient.chief_complaint && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Chief Complaint</h4>
                      <p className="text-sm text-muted-foreground">{patient.chief_complaint}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Current Symptoms</h4>
                    <p className="text-sm text-muted-foreground">{patient.symptoms || "No symptoms recorded"}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => handleViewSummary(patient)} className="gap-2">
                    <Eye className="h-4 w-4" />
                    View Summary
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(patient)} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSendEmail(patient)} className="gap-2">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
