"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "access_denied":
        return "Access denied. Please contact your administrator."
      case "server_error":
        return "Server error occurred. Please try again later."
      case "temporarily_unavailable":
        return "Service temporarily unavailable. Please try again."
      default:
        return errorDescription || "An authentication error occurred."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Header with medical branding */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">MedAI</h1>
            </div>
            <p className="text-muted-foreground">Clinical Decision Support System</p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-xl font-semibold text-center">Authentication Error</CardTitle>
              </div>
              <CardDescription className="text-center">There was a problem with your authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                {getErrorMessage(error)}
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Try Again</Link>
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  If the problem persists, contact your system administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
