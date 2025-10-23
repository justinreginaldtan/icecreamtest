"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4">
      <Card className="w-full max-w-md text-center border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color:rgba(240,78,152,.1)]">
            <ShieldAlert className="h-8 w-8 text-[var(--brandPink)]" />
          </div>
          <CardTitle className="text-2xl text-[var(--text)]">Not Authorized</CardTitle>
          <CardDescription>
            {user?.role === "employee"
              ? "Not authorized — this area is for managers."
              : "You don't have permission to access this page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
