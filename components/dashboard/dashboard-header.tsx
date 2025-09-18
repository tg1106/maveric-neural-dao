"use client"

import { useState, useEffect } from "react"

interface DashboardHeaderProps {
  doctor: {
    full_name: string
  } | null
}

const greetings = ["Hello", "Hi", "Howdy", "Welcome back"]

export function DashboardHeader({ doctor }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    // Select random greeting on component mount
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
    setGreeting(randomGreeting)
  }, [])

  const doctorName = doctor ? `Dr. ${doctor.full_name}` : "Doctor"

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">
        {greeting}, {doctorName}
      </h1>
      <p className="text-muted-foreground">Here's an overview of your patients and recent activity.</p>
    </div>
  )
}
