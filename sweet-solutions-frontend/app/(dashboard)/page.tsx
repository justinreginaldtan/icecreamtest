"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, FileText, TrendingUp, ChevronDown, ArrowRight, Calendar, AlertCircle, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { ShiftModal } from "@/components/features/shifts/shift-modal"
import { useNav } from "@/lib/utils/navigation"
import apiClient from "@/lib/api/client"

export default function DashboardPage() {
  const { user } = useAuth()
  const nav = useNav()
  const [dateRange, setDateRange] = useState("This week")
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [shifts, setShifts] = useState([])
  const [timeOffRequests, setTimeOffRequests] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data on component mount, only when user is authenticated
  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [employeesRes, shiftsRes, requestsRes] = await Promise.all([
          apiClient.getEmployees(),
          apiClient.getShifts(),
          apiClient.getTimeOffRequests()
        ])
        
        if (employeesRes.success) setEmployees(employeesRes.data || [])
        if (shiftsRes.success) setShifts(shiftsRes.data || [])
        if (requestsRes.success) setTimeOffRequests(requestsRes.data || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const totalEmployees = employees.length
  const totalHoursThisWeek = employees.reduce((sum, emp) => sum + (emp.hoursPerWeek || 0), 0)
  const pendingRequests = timeOffRequests.filter((req) => req.status === "pending").length
  const upcomingShifts = shifts.filter((shift) => new Date(shift.date) >= new Date()).length

  const nextShift = shifts.find((shift) => shift.employeeId === user?.id && new Date(shift.date) >= new Date())
  
  // Employee-specific metrics
  const myUpcomingShifts = shifts.filter((shift) => shift.employeeId === user?.id && new Date(shift.date) >= new Date())
  const myPendingRequests = timeOffRequests.filter((req) => req.employeeId === user?.id && req.status === "pending").length
  const myTotalHours = user?.role === "employee" ? (user.hoursPerWeek || 0) : totalHoursThisWeek

  if (loading) {
    return (
      <AppLayout>
        <div className="px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center animate-fade-in">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-3 text-[color:rgba(44,42,41,.6)] font-medium">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8 animate-fade-in">
            <div className="mb-10 flex items-center justify-between">
              <div className="animate-slide-up">
                <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Welcome back, {user?.name.split(" ")[0]}</h1>
                <p className="text-[color:rgba(44,42,41,.6)] text-base">
                  {user?.role === "employee" ? "Your schedule and team updates" : "Overview of your team and schedule"}
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[var(--border)] text-[var(--text)] hover:bg-[var(--muted)] hover:border-[var(--brandBlue)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none bg-transparent transition-all duration-200 animate-slide-up"
                data-testid="date-range-selector"
              >
                {dateRange} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* KPI Cards with Enhanced Visual Hierarchy */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-10">
              {/* Contextual KPIs - Subtle styling */}
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl hover:shadow-md transition-all duration-200 animate-slide-up cursor-default">
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.7)]">
                      {user?.role === "employee" ? "Team Members" : "Total Employees"}
                    </CardTitle>
                    <div className="text-2xl font-bold text-[var(--text)]">{totalEmployees}</div>
                    <p className="text-xs text-[color:rgba(44,42,41,.6)]">
                      {user?.role === "employee" ? "Your colleagues" : "Active team members"}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[color:rgba(73,182,194,.1)]">
                    <Users className="h-5 w-5 text-[color:rgba(73,182,194,.8)]" />
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl hover:shadow-md transition-all duration-200 animate-slide-up cursor-default">
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.7)]">
                      {user?.role === "employee" ? "Your Hours/Week" : "Hours This Week"}
                    </CardTitle>
                    <div className="text-2xl font-bold text-[var(--text)]">{myTotalHours}</div>
                    <p className="text-xs text-[color:rgba(44,42,41,.6)]">
                      {user?.role === "employee" ? "Your schedule" : "Scheduled hours"}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[color:rgba(73,182,194,.1)]">
                    <Clock className="h-5 w-5 text-[color:rgba(73,182,194,.8)]" />
                  </div>
                </CardHeader>
              </Card>

              {/* Actionable KPIs - Enhanced styling with primary brand color */}
              <Card className="border-[var(--primary)] bg-[var(--surface)] shadow-md rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 animate-slide-up cursor-pointer group"
                    onClick={() => nav.navigate('/requests')}>
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-sm font-medium text-[var(--primary)]">
                      {user?.role === "employee" ? "My Requests" : "Pending Requests"}
                    </CardTitle>
                    <div className="text-2xl font-bold text-[var(--text)]">
                      {user?.role === "employee" ? myPendingRequests : pendingRequests}
                    </div>
                    <p className="text-xs text-[color:rgba(44,42,41,.6)]">
                      {user?.role === "employee" ? "Your requests" : "Awaiting approval"}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--primary)] group-hover:bg-[color:rgba(244,108,91,.9)] transition-colors duration-200">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                {(user?.role === "employee" ? myPendingRequests : pendingRequests) > 0 && (
                  <div className="px-6 pb-3">
                    <div className="flex items-center text-xs text-[var(--primary)] font-medium">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      {user?.role === "employee" ? "View requests" : "Review requests"}
                    </div>
                  </div>
                )}
              </Card>

              <Card className="border-[var(--brandBlue)] bg-[var(--surface)] shadow-md rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 animate-slide-up cursor-pointer group"
                    onClick={() => nav.navigate('/schedule')}>
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-sm font-medium text-[var(--brandBlue)]">
                      {user?.role === "employee" ? "My Shifts" : "Upcoming Shifts"}
                    </CardTitle>
                    <div className="text-2xl font-bold text-[var(--text)]">
                      {user?.role === "employee" ? myUpcomingShifts.length : upcomingShifts}
                    </div>
                    <p className="text-xs text-[color:rgba(44,42,41,.6)]">
                      {user?.role === "employee" ? "Your schedule" : "Next 7 days"}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--brandBlue)] group-hover:bg-[color:rgba(73,182,194,.9)] transition-colors duration-200">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <div className="px-6 pb-3">
                  <div className="flex items-center text-xs text-[var(--brandBlue)] font-medium">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    {user?.role === "employee" ? "View schedule" : "Manage schedule"}
                  </div>
                </div>
              </Card>
            </div>

            {/* Bottom Section with Enhanced Spacing */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Next Shift Card with Enhanced Empty State */}
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl hover:shadow-md transition-all duration-200 animate-slide-up">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[var(--text)] flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[var(--brandBlue)]" />
                    {user?.role === "employee" ? "Your Next Shift" : "Your Next Shift"}
                  </CardTitle>
                  <CardDescription>
                    {user?.role === "employee" ? "Your upcoming schedule" : "Upcoming schedule details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {nextShift ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-[color:rgba(73,182,194,.05)] rounded-lg">
                        <span className="text-sm font-medium text-[color:rgba(44,42,41,.7)]">Date</span>
                        <span className="font-semibold text-[var(--text)]">
                          {new Date(nextShift.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[color:rgba(73,182,194,.05)] rounded-lg">
                        <span className="text-sm font-medium text-[color:rgba(44,42,41,.7)]">Time</span>
                        <span className="font-semibold text-[var(--text)]">
                          {nextShift.startTime} - {nextShift.endTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[color:rgba(73,182,194,.05)] rounded-lg">
                        <span className="text-sm font-medium text-[color:rgba(44,42,41,.7)]">Role</span>
                        <span className="font-semibold text-[var(--text)]">{nextShift.role}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-6">
                      <div className="mx-auto w-16 h-16 bg-[color:rgba(73,182,194,.1)] rounded-full flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-[color:rgba(73,182,194,.6)]" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[var(--text)]">No upcoming shifts</h3>
                        <p className="text-[color:rgba(44,42,41,.6)] max-w-sm mx-auto">
                          {user?.role === "employee" 
                            ? "You don't have any shifts scheduled yet. Check back later or contact your manager."
                            : "Ready to schedule your first shift? Let's get your schedule set up."
                          }
                        </p>
                      </div>
                      {user?.role !== "employee" && (
                        <Button
                          onClick={() => setIsShiftModalOpen(true)}
                          className="bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none transition-all duration-200"
                          data-testid="create-first-shift"
                          aria-label="Create your first shift"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create First Shift
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity Card with Enhanced Design */}
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl hover:shadow-md transition-all duration-200 animate-slide-up">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[var(--text)] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--brandBlue)]" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    {user?.role === "employee" ? "Your recent updates and changes" : "Latest updates and changes"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user?.role === "employee" ? (
                      <>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[color:rgba(73,182,194,.05)] transition-colors duration-200">
                          <div className="h-3 w-3 rounded-full mt-1.5 bg-[var(--brandPink)] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--text)]">Schedule updated</p>
                            <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">
                              Your shifts for next week have been posted
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[color:rgba(73,182,194,.05)] transition-colors duration-200">
                          <div className="h-3 w-3 rounded-full mt-1.5 bg-[var(--brandPink)] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--text)]">Time-off request</p>
                            <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">
                              Your request for Jan 25-27 is pending approval
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[color:rgba(73,182,194,.05)] transition-colors duration-200">
                          <div className="h-3 w-3 rounded-full mt-1.5 bg-[color:rgba(73,182,194,.4)] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--text)]">Team update</p>
                            <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">
                              Welcome Sarah to the team this week
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[color:rgba(73,182,194,.05)] transition-colors duration-200">
                          <div className="h-3 w-3 rounded-full mt-1.5 bg-[var(--brandPink)] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--text)]">New time-off request</p>
                            <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">
                              Chatcha requested time off for Jan 25-27
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[color:rgba(73,182,194,.05)] transition-colors duration-200">
                          <div className="h-3 w-3 rounded-full mt-1.5 bg-[var(--brandPink)] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--text)]">Schedule updated</p>
                            <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">5 new shifts added for next week</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[color:rgba(73,182,194,.05)] transition-colors duration-200">
                          <div className="h-3 w-3 rounded-full mt-1.5 bg-[color:rgba(73,182,194,.4)] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--text)]">Payroll processed</p>
                            <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">January payroll completed successfully</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

      <ShiftModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </AppLayout>
  )
}
