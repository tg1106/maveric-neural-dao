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
    3. [Third recommendation]`

      try {
          const response = await fetch(
                "https://api-inference.huggingface.co/models/microsoft/BioGPT-Large",
                      {
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
                                                                                                                                                                      }
                                                                                                                                                                          )

                                                                                                                                                                              if (!response.ok) {
                                                                                                                                                                                    const errText = await response.text()
                                                                                                                                                                                          throw new Error(`Hugging Face API error: ${response.status} - ${errText}`)
                                                                                                                                                                                              }

                                                                                                                                                                                                  const result = await response.json()

                                                                                                                                                                                                      // --- normalize output ---
                                                                                                                                                                                                          let generatedText = ""
                                                                                                                                                                                                              if (Array.isArray(result) && result.length > 0) {
                                                                                                                                                                                                                    generatedText = result[0]?.generated_text || result[0]?.output_text || ""
                                                                                                                                                                                                                        } else if (result.generated_text) {
                                                                                                                                                                                                                              generatedText = result.generated_text
                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                      if (!generatedText) {
                                                                                                                                                                                                                                            console.error("Unexpected Hugging Face API response:", result)
                                                                                                                                                                                                                                                  throw new Error("Unexpected Hugging Face API response format")
                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                          // --- parse analysis & recommendations ---
                                                                                                                                                                                                                                                              let analysisPart = generatedText
                                                                                                                                                                                                                                                                  let recPart = ""

                                                                                                                                                                                                                                                                      if (generatedText.includes("RECOMMENDATIONS:")) {
                                                                                                                                                                                                                                                                            ;[analysisPart, recPart] = generatedText.split("RECOMMENDATIONS:")
                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                    const analysisClean = analysisPart.replace("ANALYSIS:", "").trim()

                                                                                                                                                                                                                                                                                        const recommendations = extractExactly3Recommendations(
                                                                                                                                                                                                                                                                                              recPart || generatedText,
                                                                                                                                                                                                                                                                                                    chief_complaint
                                                                                                                                                                                                                                                                                                        )

                                                                                                                                                                                                                                                                                                            return {
                                                                                                                                                                                                                                                                                                                  analysis: analysisClean,
                                                                                                                                                                                                                                                                                                                        recommendations,
                                                                                                                                                                                                                                                                                                                              confidence: 0.85,
                                                                                                                                                                                                                                                                                                                                    source: "BioGPT-Large",
                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                          } catch (error) {
                                                                                                                                                                                                                                                                                                                                              console.error("Hugging Face API call failed:", error)
                                                                                                                                                                                                                                                                                                                                                  throw error
                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                    }
