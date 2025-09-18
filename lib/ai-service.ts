export interface ClinicalAnalysisRequest {
  patient: {
    name: string
    age: number
    gender: string
    chief_complaint: string
    symptoms: string[]
    medical_history: string[]
  }
  patientId: string
}

export interface ClinicalAnalysisResponse {
  analysis: string
  recommendations: string[]
  confidence: number
  source: string
}

export class AIService {
  private static readonly HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/microsoft/BioGPT-Large"

  static async generateClinicalAnalysis(request: ClinicalAnalysisRequest): Promise<ClinicalAnalysisResponse> {
    const apiKey = process.env.HUGGINGFACE_API_KEY

    if (!apiKey) {
      console.warn("HUGGINGFACE_API_KEY not configured, using fallback analysis")
      return this.generateFallbackAnalysis(request.patient)
    }

    try {
      return await this.callHuggingFaceAPI(request.patient, apiKey)
    } catch (error) {
      console.error("AI service error, using fallback:", error)
      return this.generateFallbackAnalysis(request.patient)
    }
  }

  private static async callHuggingFaceAPI(patient: any, apiKey: string): Promise<ClinicalAnalysisResponse> {
    const prompt = this.buildClinicalPrompt(patient)

    const response = await fetch(this.HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    let generatedText = ""
    if (Array.isArray(result) && result[0]?.generated_text) {
      generatedText = result[0].generated_text
    } else if (result.generated_text) {
      generatedText = result.generated_text
    } else {
      throw new Error("Unexpected API response format")
    }

    return {
      analysis: generatedText.trim(),
      recommendations: this.extractRecommendations(generatedText),
      confidence: 0.85,
      source: "BioGPT-Large",
    }
  }

  private static buildClinicalPrompt(patient: any): string {
    const { name, age, gender, chief_complaint, symptoms, medical_history } = patient

    return `Clinical Case Analysis:

Patient: ${name}, ${age}-year-old ${gender}
Chief Complaint: ${chief_complaint || "Not specified"}
Current Symptoms: ${symptoms?.join(", ") || "None reported"}
Medical History: ${medical_history?.join(", ") || "None reported"}

Please provide a clinical analysis including:
1. Differential diagnosis considerations
2. Recommended diagnostic workup
3. Treatment recommendations
4. Follow-up care suggestions

Analysis:`
  }

  private static extractRecommendations(analysisText: string): string[] {
    const recommendations: string[] = []
    const lines = analysisText.split("\n")

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (/^\d+\.\s/.test(trimmedLine)) {
        recommendations.push(trimmedLine.replace(/^\d+\.\s/, ""))
      } else if (/^[-*•]\s/.test(trimmedLine)) {
        recommendations.push(trimmedLine.replace(/^[-*•]\s/, ""))
      } else if (/^(Recommend|Consider|Suggest)/i.test(trimmedLine)) {
        recommendations.push(trimmedLine)
      }
    }

    if (recommendations.length === 0) {
      recommendations.push("Complete comprehensive physical examination")
      recommendations.push("Order appropriate diagnostic tests based on clinical presentation")
      recommendations.push("Monitor vital signs and symptom progression")
      recommendations.push("Schedule follow-up appointment within 1-2 weeks")
    }

    return recommendations.slice(0, 6)
  }

  private static generateFallbackAnalysis(patient: any): ClinicalAnalysisResponse {
    const { name, age, gender, chief_complaint, symptoms, medical_history } = patient

    let analysis = `Clinical Assessment for ${name} (${age}-year-old ${gender}):\n\n`

    if (chief_complaint) {
      analysis += `Chief Complaint: ${chief_complaint}\n\n`
    }

    if (symptoms && symptoms.length > 0) {
      analysis += `Current Symptoms Analysis:\nThe patient presents with ${symptoms.join(", ").toLowerCase()}. `

      if (symptoms.includes("Chest Pain")) {
        analysis += `Chest pain requires immediate evaluation to rule out cardiac causes. `
      }
      if (symptoms.includes("Shortness of breath")) {
        analysis += `Dyspnea may indicate respiratory or cardiac involvement. `
      }
      if (symptoms.includes("Fever")) {
        analysis += `Fever suggests possible infectious etiology. `
      }

      analysis += `\n\n`
    }

    if (medical_history && medical_history.length > 0) {
      analysis += `Medical History Considerations:\nPatient has a history of ${medical_history.join(", ").toLowerCase()}. `

      if (medical_history.includes("Diabetes Type 2")) {
        analysis += `Diabetes management should be optimized and blood glucose monitored closely. `
      }
      if (medical_history.includes("Hypertension")) {
        analysis += `Blood pressure control is essential for cardiovascular risk reduction. `
      }
      if (medical_history.includes("Heart Disease")) {
        analysis += `Cardiac status requires careful monitoring and specialist consultation may be warranted. `
      }

      analysis += `\n\n`
    }

    analysis += `Recommended Approach:\nBased on the clinical presentation, a systematic evaluation is recommended including appropriate diagnostic testing, symptom management, and consideration of the patient's medical history in treatment planning.`

    const recommendations = []

    if (symptoms?.includes("Chest Pain")) {
      recommendations.push("Obtain ECG and cardiac enzymes to rule out acute coronary syndrome")
      recommendations.push("Consider chest X-ray to evaluate for pulmonary causes")
    }

    if (symptoms?.includes("Fever")) {
      recommendations.push("Complete blood count with differential")
      recommendations.push("Blood cultures if indicated")
    }

    if (medical_history?.includes("Diabetes Type 2")) {
      recommendations.push("Monitor blood glucose levels closely")
      recommendations.push("Review current diabetes medications and adjust as needed")
    }

    if (medical_history?.includes("Hypertension")) {
      recommendations.push("Blood pressure monitoring and optimization")
    }

    recommendations.push("Comprehensive physical examination")
    recommendations.push("Review current medications for interactions or adjustments")
    recommendations.push("Patient education regarding symptoms and when to seek immediate care")
    recommendations.push("Follow-up appointment in 1-2 weeks or sooner if symptoms worsen")

    return {
      analysis,
      recommendations,
      confidence: 0.75,
      source: "Fallback Analysis (Configure HUGGINGFACE_API_KEY for AI-powered analysis)",
    }
  }
}
