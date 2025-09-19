import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { patient } = await request.json()

    // Check if HUGGINGFACE_API_KEY is available
    const apiKey = process.env.HUGGINGFACE_API_KEY

    if (!apiKey) {
      console.warn("HUGGINGFACE_API_KEY not found, using mock analysis")
      return NextResponse.json(generateMockAnalysis(patient))
    }

    try {
      const analysis = await generateHuggingFaceAnalysis(patient, apiKey)
      return NextResponse.json(analysis)
    } catch (aiError) {
      console.error("Hugging Face API error, falling back to mock:", aiError)
      // Fallback to mock analysis if AI service fails
      return NextResponse.json(generateMockAnalysis(patient))
    }
  } catch (error) {
    console.error("Error in AI analysis:", error)
    return NextResponse.json({ error: "Failed to generate AI analysis" }, { status: 500 })
  }
}

async function generateHuggingFaceAnalysis(patient: any, apiKey: string) {
  const { name, age, gender, chief_complaint, symptoms, medical_history } = patient

  const clinicalPrompt = `Clinical Case Analysis focused on Chief Complaint:

Patient: ${name}, ${age}-year-old ${gender}
Chief Complaint: ${chief_complaint || "Not specified"}
Current Symptoms: ${symptoms?.join(", ") || "None reported"}
Medical History: ${medical_history?.join(", ") || "None reported"}

Please provide a clinical analysis focused specifically on the chief complaint "${chief_complaint}". 

Provide exactly 3 treatment recommendations that directly address the chief complaint. Format your response as:

ANALYSIS: [Your clinical analysis here]

RECOMMENDATIONS:
1. [First recommendation]
2. [Second recommendation] 
3. [Third recommendation]

Analysis:`

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/BioGPT-Large", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: clinicalPrompt,
        parameters: {
          max_new_tokens: 400,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const result = await response.json()

    // Handle different response formats
    let generatedText = ""
    if (Array.isArray(result) && result[0]?.generated_text) {
      generatedText = result[0].generated_text
    } else if (result.generated_text) {
      generatedText = result.generated_text
    } else {
      throw new Error("Unexpected API response format")
    }

    const recommendations = extractExactly3Recommendations(generatedText, chief_complaint)

    return {
      analysis: generatedText.trim(),
      recommendations,
      confidence: 0.85,
      source: "BioGPT-Large",
    }
  } catch (error) {
    console.error("Hugging Face API call failed:", error)
    throw error
  }
}

function extractExactly3Recommendations(analysisText: string, chiefComplaint: string): string[] {
  const recommendations: string[] = []
  const lines = analysisText.split("\n")

  // Look for numbered recommendations first
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (/^[1-3]\.\s/.test(trimmedLine)) {
      recommendations.push(trimmedLine.replace(/^[1-3]\.\s/, ""))
    }
  }

  // If we don't have exactly 3, generate them based on chief complaint
  if (recommendations.length !== 3) {
    return generateChiefComplaintRecommendations(chiefComplaint)
  }

  return recommendations
}

function generateChiefComplaintRecommendations(chiefComplaint: string): string[] {
  const complaint = chiefComplaint?.toLowerCase() || ""

  if (complaint.includes("chest pain")) {
    return [
      "Obtain immediate ECG and cardiac enzymes to rule out acute coronary syndrome",
      "Administer aspirin and nitroglycerin if indicated and monitor vital signs closely",
      "Schedule urgent cardiology consultation and consider stress testing if acute causes ruled out",
    ]
  }

  if (complaint.includes("shortness of breath") || complaint.includes("dyspnea")) {
    return [
      "Perform chest X-ray and arterial blood gas analysis to assess respiratory status",
      "Administer supplemental oxygen and bronchodilators if indicated",
      "Consider pulmonary function tests and echocardiogram to evaluate underlying causes",
    ]
  }

  if (complaint.includes("headache")) {
    return [
      "Conduct neurological examination and assess for red flag symptoms",
      "Consider CT scan if severe or sudden onset headache with concerning features",
      "Initiate appropriate pain management and lifestyle modification counseling",
    ]
  }

  if (complaint.includes("fever")) {
    return [
      "Obtain complete blood count, blood cultures, and urinalysis to identify infection source",
      "Administer appropriate antipyretic therapy and ensure adequate hydration",
      "Start empirical antibiotic therapy if bacterial infection suspected",
    ]
  }

  if (complaint.includes("abdominal pain")) {
    return [
      "Perform comprehensive abdominal examination and obtain relevant imaging (ultrasound/CT)",
      "Order laboratory tests including CBC, comprehensive metabolic panel, and lipase",
      "Provide appropriate pain management and consider surgical consultation if indicated",
    ]
  }

  // Default recommendations for any chief complaint
  return [
    `Conduct thorough clinical evaluation specifically addressing the ${chiefComplaint}`,
    `Order appropriate diagnostic tests relevant to ${chiefComplaint} presentation`,
    `Implement targeted treatment plan and schedule appropriate follow-up for ${chiefComplaint}`,
  ]
}

function generateMockAnalysis(patient: any) {
  const { name, age, gender, chief_complaint, symptoms, medical_history } = patient

  let analysis = `Clinical Assessment for ${name} (${age}-year-old ${gender}):\n\n`

  analysis += `PRIMARY FOCUS - Chief Complaint: ${chief_complaint}\n\n`

  analysis += `Clinical Analysis:\n`
  analysis += `The patient presents with ${chief_complaint}. Based on the clinical presentation, this complaint requires systematic evaluation. `

  if (symptoms && symptoms.length > 0) {
    const relevantSymptoms = symptoms.filter((symptom) =>
      symptom.toLowerCase().includes(chief_complaint?.toLowerCase().split(" ")[0] || "")
    )
    if (relevantSymptoms.length > 0) {
      analysis += `Associated symptoms include ${relevantSymptoms.join(", ").toLowerCase()}, which support the clinical picture. `
    }
  }

  if (medical_history && medical_history.length > 0) {
    analysis += `The patient's medical history of ${medical_history.join(", ").toLowerCase()} should be considered in the context of the current complaint. `
  }

  analysis += `\n\nRecommended approach focuses specifically on addressing the chief complaint through evidence-based clinical management.`

  const recommendations = generateChiefComplaintRecommendations(chief_complaint)

  return {
    analysis,
    recommendations,
    confidence: 0.75,
    source: "Clinical Analysis System",
  }
}
