"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, FileText, TrendingUp, ChevronDown } from "lucide-react"
import { employees, shifts, timeOffRequests } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { ShiftModal } from "@/components/shift-modal"
import { useNav } from "@/lib/ui-actions"

export default function DashboardPage() {
  const { user } = useAuth()
  const nav = useNav()
  const [dateRange, setDateRange] = useState("This week")
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)

  const totalEmployees = employees.length
  const totalHoursThisWeek = employees.reduce((sum, emp) => sum + emp.hours, 0)
  const pendingRequests = timeOffRequests.filter((req) => req.status === "pending").length
  const upcomingShifts = shifts.filter((shift) => new Date(shift.date) >= new Date()).length

  const nextShift = shifts.find((shift) => shift.employeeId === 1 && new Date(shift.date) >= new Date())

  return (
    <AppLayout>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="ml-64 flex-1">
          <Header />

          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text)]">Welcome back, {user?.name.split(" ")[0]}</h1>
                <p className="text-[color:rgba(44,42,41,.6)] mt-1">Overview of your team and schedule</p>
              </div>
              <Button
                variant="outline"
                className="border-[var(--border)] text-[var(--text)] hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none bg-transparent"
                data-testid="date-range-selector"
              >
                {dateRange} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Total Employees</CardTitle>
                    <div className="text-2xl font-semibold text-[var(--text)]">{totalEmployees}</div>
                    <p className="text-xs text-[color:rgba(44,42,41,.6)]">Active team members</p>
                  </div>
                  <Users className="h-5 w-5 text-[color:rgba(73,182,194,.7)]" />
                </CardHeader>
              </Card>

              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Hours This Week</CardTitle>
                    <div className="text-2xl font-semibold text-[var(--text)]">{totalHoursThisWeek}</div>
                    <p className="text-xs text-[color:rgba(44,42,41,.6)]">Scheduled hours</p>
                  </div>
                  <Clock className="h-5 w-5 text-[color:rgba(73,182,194,.7)]" />
                </CardHeader>
              </Card>

              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Pending Requests</CardTitle>
                    <div className="text-2xl font-semibold text-[var(--text)]">{pendingRequests}</div>
                    <p className="text-xs text-[color:rgba(44,42,41,.6)]">Awaiting approval</p>
                  </div>
                  <FileText className="h-5 w-5 text-[color:rgba(73,182,194,.7)]" />
                </CardHeader>
              </Card>

              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Upcoming Shifts</CardTitle>
                    <div className="text-2xl font-semibold text-[var(--text)]">{upcomingShifts}</div>
                    <p className="text-xs text-[color:rgba(44,42,41,.6)]">Next 7 days</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-[color:rgba(73,182,194,.7)]" />
                </CardHeader>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-[var(--text)]">Your Next Shift</CardTitle>
                  <CardDescription>Upcoming schedule details</CardDescription>
                </CardHeader>
                <CardContent>
                  {nextShift ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[color:rgba(44,42,41,.7)]">Date</span>
                        <span className="font-medium text-[var(--text)]">
                          {new Date(nextShift.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[color:rgba(44,42,41,.7)]">Time</span>
                        <span className="font-medium text-[var(--text)]">
                          {nextShift.startTime} - {nextShift.endTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[color:rgba(44,42,41,.7)]">Role</span>
                        <span className="font-medium text-[var(--text)]">{nextShift.role}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <p className="text-[color:rgba(44,42,41,.7)]">No upcoming shifts — create the first one.</p>
                      <Button
                        onClick={() => setIsShiftModalOpen(true)}
                        className="bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                        data-testid="create-first-shift"
                        aria-label="Create your first shift"
                      >
                        Create Shift
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-[var(--text)]">Recent Activity</CardTitle>
                  <CardDescription>Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-2 bg-[var(--brandPink)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text)]">New time-off request</p>
                        <p className="text-xs text-[color:rgba(44,42,41,.6)]">
                          Chatcha requested time off for Jan 25-27
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-2 bg-[var(--brandPink)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text)]">Schedule updated</p>
                        <p className="text-xs text-[color:rgba(44,42,41,.6)]">5 new shifts added for next week</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-2 bg-[var(--muted)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text)]">Payroll processed</p>
                        <p className="text-xs text-[color:rgba(44,42,41,.6)]">January payroll completed successfully</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <ShiftModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </AppLayout>
  )
}
