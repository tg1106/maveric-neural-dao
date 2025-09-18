import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, AlertCircle } from "lucide-react"

interface StatsCardsProps {
  totalPatients: number
  recentActivity: number
  pendingAnalyses: number
}

export function StatsCards({ totalPatients, recentActivity, pendingAnalyses }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Patients",
      value: totalPatients,
      icon: Users,
      description: "Patients under your care",
      color: "text-primary",
    },
    {
      title: "Recent Activity",
      value: recentActivity,
      icon: Activity,
      description: "New patients this week",
      color: "text-secondary",
    },
    {
      title: "Pending Analysis",
      value: pendingAnalyses,
      icon: AlertCircle,
      description: "Awaiting AI analysis",
      color: "text-accent",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
