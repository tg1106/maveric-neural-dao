"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@supabase/supabase-js"

interface TopNavProps {
  user: User
}

export function TopNav({ user }: TopNavProps) {
  const getInitials = (email: string) => {
    return email.split("@")[0].slice(0, 2).toUpperCase()
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Clinical Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getInitials(user.email || "")}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium text-foreground">{user.email}</p>
            <p className="text-muted-foreground">Healthcare Professional</p>
          </div>
        </div>
      </div>
    </header>
  )
}
