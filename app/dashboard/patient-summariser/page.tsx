import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientSummaryList } from "@/components/patient-summariser/patient-summary-list"

export default async function PatientSummariserPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get doctor profile
  const { data: doctor } = await supabase.from("doctors").select("*").eq("id", data.user.id).single()

  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .eq("doctor_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Patient Summariser</h1>
        <p className="text-muted-foreground">
          Generate comprehensive patient summaries and export them as PDF or send via email.
        </p>
      </div>
      <PatientSummaryList patients={patients || []} doctor={doctor} />
    </div>
  )
}
