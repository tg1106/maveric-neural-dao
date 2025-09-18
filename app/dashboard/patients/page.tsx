import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { redirect } from "next/navigation"

export default async function PatientsPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  // Get doctor profile
  const { data: doctor } = await supabase.from("doctors").select("*").eq("id", user.id).single()

  if (!doctor) {
    redirect("/auth/login")
  }

  // Get all patients for this doctor
  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .eq("doctor_id", doctor.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patients</h1>
        <p className="text-muted-foreground">View and manage your patients</p>
      </div>

      {patients && patients.length > 0 ? (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <Card key={patient.id} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Age: {patient.age}</span>
                      <span>Gender: {patient.gender}</span>
                    </div>
                    <p className="text-sm text-foreground">
                      <strong>Chief Complaint:</strong> {patient.chief_complaint || patient.symptoms || "Not specified"}
                    </p>
                    {patient.symptoms && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Symptoms:</strong> {patient.symptoms}
                      </p>
                    )}
                    {patient.notes && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {patient.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {formatDistanceToNow(new Date(patient.created_at), { addSuffix: true })}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No patients found</p>
            <p className="text-sm text-muted-foreground mt-1">Start by adding your first patient</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
