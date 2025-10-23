"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNav } from "@/lib/ui-actions"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, user } = useAuth()
  const nav = useNav()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate async login
    await new Promise((resolve) => setTimeout(resolve, 600))

    const success = login(email, password)
    if (success) {
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${user?.name || "User"}!`,
        className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
      })
      nav.toDashboard()
    } else {
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  const isFormValid = email && password

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4">
      <Card className="w-full max-w-md border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-[var(--text)]">Sweet Solutions</CardTitle>
          <div className="h-0.5 w-16 mx-auto rounded-full bg-[var(--brandBlue)]" />
          <CardDescription>Sign in to access scheduling and payroll</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert" aria-live="polite">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              aria-busy={isLoading}
              className="w-full bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
              data-testid="login-button"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div
            className="mt-6 space-y-2 rounded-lg p-4 text-sm"
            style={{ backgroundColor: "var(--muted)", borderLeft: "3px solid var(--brandBlue)" }}
          >
            <p className="font-medium text-[var(--brandPink)]">Demo Accounts:</p>
            <div className="space-y-1 text-[color:rgba(44,42,41,.7)]">
              <p>
                <strong>Manager:</strong> mari.lisa@example.com / demo123
              </p>
              <p>
                <strong>Employee:</strong> justin.tan@example.com / demo123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
