import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { patient, doctor } = await request.json()

    // For now, we'll simulate sending an email
    // In a real implementation, this would use an email service like SendGrid, Resend, or Nodemailer
    const emailContent = generateEmailContent(patient, doctor)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Mock email sent:", emailContent)

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

function generateEmailContent(patient: any, doctor: any) {
  const latestAnalysis = patient.ai_analyses && patient.ai_analyses.length > 0 ? patient.ai_analyses[0] : null

  return {
    to: patient.email || "patient@example.com",
    from: "noreply@medai.com",
    subject: `Patient Summary - ${patient.first_name} ${patient.last_name}`,
    html: `
      <h2>Patient Summary</h2>
      <p><strong>Patient:</strong> ${patient.first_name} ${patient.last_name}</p>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>Gender:</strong> ${patient.gender}</p>
      <p><strong>Doctor:</strong> Dr. ${doctor.first_name} ${doctor.last_name}</p>
      
      <h3>Chief Complaint</h3>
      <p>${patient.chief_complaint || "Not specified"}</p>
      
      <h3>Latest AI Analysis</h3>
      <p>${latestAnalysis ? latestAnalysis.summary : "No analysis available"}</p>
    `,
  }
}
