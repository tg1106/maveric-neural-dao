"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface NewPatientFormProps {
  doctorId: string
}

const SYMPTOM_OPTIONS = [
  "Chest Pain",
  "Shortness of breath",
  "Fatigue",
  "Dizziness",
  "Nausea",
  "Headache",
  "Fever",
  "Cough",
  "Abdominal Pain",
  "Joint pain",
  "Back pain",
  "Palpitations",
  "Swelling",
  "Rash",
  "Vision change",
]

const MEDICAL_HISTORY_OPTIONS = [
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Hypertension",
  "Asthma",
  "COPD",
  "Heart Disease",
  "Stroke",
  "Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Thyroid Disease",
  "Depression",
  "Anxiety",
  "Arthritis",
  "Osteoporosis",
]

export function NewPatientForm({ doctorId }: NewPatientFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("")
  const [chiefComplaint, setChiefComplaint] = useState("")

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<string[]>([])
  const [customMedicalHistory, setCustomMedicalHistory] = useState("")

  const [bloodPressure, setBloodPressure] = useState("")
  const [heartRate, setHeartRate] = useState("")
  const [temperature, setTemperature] = useState("")
  const [oxygenSaturation, setOxygenSaturation] = useState("")

  const [notes, setNotes] = useState("")

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()])
      setCustomSymptom("")
    }
  }

  const toggleMedicalHistory = (condition: string) => {
    setSelectedMedicalHistory((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  const addCustomMedicalHistory = () => {
    if (customMedicalHistory.trim() && !selectedMedicalHistory.includes(customMedicalHistory.trim())) {
      setSelectedMedicalHistory((prev) => [...prev, customMedicalHistory.trim()])
      setCustomMedicalHistory("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error: patientError } = await supabase.from("patients").insert({
        doctor_id: doctorId,
        name,
        age: Number.parseInt(age),
        gender,
        chief_complaint: chiefComplaint,
        symptoms: selectedSymptoms.join(", "),
        notes: `Vital Signs - BP: ${bloodPressure}, HR: ${heartRate}, Temp: ${temperature}, O2: ${oxygenSaturation}%\n\nMedical History: ${selectedMedicalHistory.join(", ")}\n\nAdditional Notes: ${notes}`,
      })

      if (patientError) throw patientError

      toast.success("Patient added successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error adding patient:", error)
      toast.error("Failed to add patient. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Patient Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter patient's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
            <Input
              id="chiefComplaint"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Main reason for visit (e.g., chest pain, headache)"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={gender} onValueChange={(value: "male" | "female" | "other") => setGender(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((symptom) => (
              <Badge
                key={symptom}
                variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add custom symptom..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSymptom())}
            />
            <Button type="button" variant="outline" onClick={addCustomSymptom}>
              Add
            </Button>
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Symptoms:</Label>
              <div className="flex flex-wrap gap-1">
                {selectedSymptoms.map((symptom) => (
                  <Badge
                    key={symptom}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {symptom} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Blood Pressure</Label>
              <Input
                id="bloodPressure"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="72"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="98.6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
              <Input
                id="oxygenSaturation"
                type="number"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(e.target.value)}
                placeholder="98"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {MEDICAL_HISTORY_OPTIONS.map((condition) => (
              <Badge
                key={condition}
                variant={selectedMedicalHistory.includes(condition) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleMedicalHistory(condition)}
              >
                {condition}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add custom medical condition..."
              value={customMedicalHistory}
              onChange={(e) => setCustomMedicalHistory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomMedicalHistory())}
            />
            <Button type="button" variant="outline" onClick={addCustomMedicalHistory}>
              Add
            </Button>
          </div>

          {selectedMedicalHistory.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Medical History:</Label>
              <div className="flex flex-wrap gap-1">
                {selectedMedicalHistory.map((condition) => (
                  <Badge
                    key={condition}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleMedicalHistory(condition)}
                  >
                    {condition} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about the patient..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding Patient..." : "Add Patient"}
        </Button>
      </div>
    </form>
  )
}
