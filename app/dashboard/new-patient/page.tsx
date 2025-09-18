import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewPatientForm } from "@/components/forms/new-patient-form"

export default async function NewPatientPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Add New Patient</h1>
        <p className="text-muted-foreground">Enter patient information and medical details for comprehensive care.</p>
      </div>
      <NewPatientForm doctorId={data.user.id} />
    </div>
  )
}
