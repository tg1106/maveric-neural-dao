import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientList } from "@/components/ai-analyser/patient-list"

export default async function AIAnalyserPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .eq("doctor_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI Analyser</h1>
        <p className="text-muted-foreground">
          Generate AI-powered treatment plans and clinical insights for your patients.
        </p>
      </div>
      <PatientList patients={patients || []} doctorId={data.user.id} />
    </div>
  )
}
