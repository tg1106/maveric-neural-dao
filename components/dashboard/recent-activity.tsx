import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface RecentActivityProps {
  doctorId: string
}

export async function RecentActivity({ doctorId }: RecentActivityProps) {
  const supabase = await createClient()

  // Get recent patients
  const { data: recentPatients } = await supabase
    .from("patients")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentPatients && recentPatients.length > 0 ? (
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.chief_complaint || patient.symptoms || "No chief complaint recorded"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={patient.patient_type === "inpatient" ? "default" : "secondary"}>
                    {patient.patient_type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(patient.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-1">Start by adding your first patient</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
