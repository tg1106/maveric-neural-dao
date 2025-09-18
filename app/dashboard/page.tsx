import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get doctor profile
  const { data: doctor } = await supabase.from("doctors").select("*").eq("id", data.user.id).single()

  // Get patient statistics
  const { count: totalPatients } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true })
    .eq("doctor_id", data.user.id)

  const { count: recentPatients } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true })
    .eq("doctor_id", data.user.id)
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const { count: pendingAnalyses } = await supabase
    .from("patients")
    .select(
      `
      id,
      ai_analyses!left(id)
    `,
      { count: "exact", head: true },
    )
    .eq("doctor_id", data.user.id)
    .is("ai_analyses.id", null)

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader doctor={doctor} />
      <StatsCards
        totalPatients={totalPatients || 0}
        recentActivity={recentPatients || 0}
        pendingAnalyses={pendingAnalyses || 0}
      />
      <RecentActivity doctorId={data.user.id} />
    </div>
  )
}
