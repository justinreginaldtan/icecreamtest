"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const [accountSettings, setAccountSettings] = useState({
    name: "Mari Lisa",
    email: "mari.lisa@example.com",
    phone: "(555) 123-4567",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    shiftReminders: true,
    requestAlerts: true,
    payrollUpdates: false,
  })

  useEffect(() => {
    if (user && user.role !== "manager") {
      router.push("/unauthorized")
    }
  }, [user, router])

  if (user?.role !== "manager") {
    return null
  }

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving account settings:", accountSettings)

    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully.",
    })
  }

  const handleSaveNotifications = () => {
    console.log("Saving notification settings:", notifications)

    toast({
      title: "Preferences updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Account Information</CardTitle>
            <CardDescription>Update your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={accountSettings.name}
                  onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountSettings.email}
                  onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={accountSettings.phone}
                  onChange={(e) => setAccountSettings({ ...accountSettings, phone: e.target.value })}
                />
              </div>

              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to receive updates and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shift-reminders" className="text-base">
                  Shift Reminders
                </Label>
                <p className="text-sm text-muted-foreground">Get notified before your shifts</p>
              </div>
              <Switch
                id="shift-reminders"
                checked={notifications.shiftReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, shiftReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="request-alerts" className="text-base">
                  Request Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Alerts for new time-off requests</p>
              </div>
              <Switch
                id="request-alerts"
                checked={notifications.requestAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, requestAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payroll-updates" className="text-base">
                  Payroll Updates
                </Label>
                <p className="text-sm text-muted-foreground">Notifications about payroll processing</p>
              </div>
              <Switch
                id="payroll-updates"
                checked={notifications.payrollUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, payrollUpdates: checked })}
              />
            </div>

            <Button
              onClick={handleSaveNotifications}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">System Information</CardTitle>
            <CardDescription>Application details and version</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Environment</span>
              <span className="font-medium text-foreground">Production (AWS)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium text-foreground">January 2025</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
