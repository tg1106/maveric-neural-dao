"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  chief_complaint: string
  symptoms: string[]
  medical_history: string[]
  vital_signs: any
}

interface AIAnalysisButtonProps {
  patient: Patient
  doctorId: string
}

export function AIAnalysisButton({ patient, doctorId }: AIAnalysisButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const generateAnalysis = async () => {
    setIsGenerating(true)

    try {
      const patientData = {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        chief_complaint: patient.chief_complaint,
        symptoms: patient.symptoms || [],
        medical_history: patient.medical_history || [],
      }

      console.log("[v0] Generating AI analysis for patient:", patientData)

      // Call AI analysis API
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient: patientData,
          patientId: patient.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate AI analysis")
      }

      const result = await response.json()
      console.log("[v0] AI analysis result:", result)

      // Save analysis to database
      const { error } = await supabase.from("ai_analyses").insert({
        patient_id: patient.id,
        analysis_text: result.analysis,
        confidence_score: result.confidence || 0.8,
        recommendations: result.recommendations || [],
      })

      if (error) {
        console.error("[v0] Database error:", error)
        throw error
      }

      toast.success("AI analysis generated successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error generating AI analysis:", error)
      toast.error("Failed to generate AI analysis. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={generateAnalysis} disabled={isGenerating} size="sm" className="gap-2">
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Brain className="h-4 w-4" />
          Generate AI Analysis
        </>
      )}
    </Button>
  )
}
