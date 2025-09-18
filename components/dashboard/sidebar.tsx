"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, UserPlus, Brain, FileText, Stethoscope, LogOut, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "New Patient",
    href: "/dashboard/new-patient",
    icon: UserPlus,
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: Users,
  },
  {
    title: "AI Analyser",
    href: "/dashboard/ai-analyser",
    icon: Brain,
  },
  {
    title: "Patient Summariser",
    href: "/dashboard/patient-summariser",
    icon: FileText,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r border-border">
      {/* Logo and branding */}
      <div className="flex items-center gap-2 p-6 border-b border-border">
        <Stethoscope className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-foreground">MedAI</h1>
          <p className="text-sm text-muted-foreground">Clinical Support</p>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={cn("w-full justify-start gap-3 h-11", isActive && "bg-primary text-primary-foreground")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Sign out button */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
