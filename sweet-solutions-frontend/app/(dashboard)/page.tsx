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

  // Check if user is an employee
  const isEmployee = user?.role === "employee"

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
                  {isEmployee ? "Your schedule and team updates" : "Overview of your team and schedule"}
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

            {/* KPI Cards - Minimal for employees, full for admins */}
            <div className={`grid gap-4 mb-10 ${isEmployee ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
              {/* Total Employees - Hidden for employees */}
              {!isEmployee && (
                <Card className="group border border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl hover:shadow hover:-translate-y-0.5 hover:border-[var(--brandBlue)]/40 transition-all duration-300 animate-slide-up">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 pt-4">
                    <div className="space-y-1">
                      <CardTitle className="text-xs font-medium text-[color:rgba(44,42,41,.6)]">
                        Total Employees
                      </CardTitle>
                      <div className="text-3xl font-bold text-[var(--text)]">{totalEmployees}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[color:rgba(59,175,218,.08)] group-hover:bg-[color:rgba(59,175,218,.12)] transition-colors duration-300">
                      <Users className="h-5 w-5 text-[color:rgba(59,175,218,.7)]" />
                    </div>
                  </CardHeader>
                </Card>
              )}

              {/* Hours This Week - Minimal for employees */}
              <Card className={`group shadow-sm rounded-xl transition-all duration-300 animate-slide-up ${isEmployee ? 'bg-gradient-to-br from-[color:rgba(142,213,226,.1)] to-[color:rgba(142,213,226,.05)] hover:from-[color:rgba(142,213,226,.15)] hover:to-[color:rgba(142,213,226,.08)] border-0' : 'border border-[var(--border)] bg-[var(--surface)] hover:shadow hover:-translate-y-0.5 hover:border-[var(--brandBlue)]/40'}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 pt-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xs font-medium text-[color:rgba(26,26,26,.5)]">
                      {isEmployee ? "Hours This Week" : "Hours This Week"}
                    </CardTitle>
                    <div className={`${isEmployee ? 'text-2xl' : 'text-3xl'} font-bold text-[var(--text)]`}>{myTotalHours}</div>
                  </div>
                  <div className={`p-2.5 rounded-lg transition-colors duration-300 ${isEmployee ? 'bg-[color:rgba(142,213,226,.15)]' : 'bg-[color:rgba(59,175,218,.08)] group-hover:bg-[color:rgba(59,175,218,.12)]'}`}>
                    <Clock className={`h-5 w-5 ${isEmployee ? 'text-[var(--brandBlue)]' : 'text-[color:rgba(59,175,218,.7)]'}`} />
                  </div>
                </CardHeader>
              </Card>

              {/* My Requests / Pending Requests */}
              <Card className={`group shadow-sm rounded-xl transition-all duration-300 animate-slide-up cursor-pointer ${isEmployee ? 'bg-gradient-to-br from-[color:rgba(255,107,157,.1)] to-[color:rgba(255,107,157,.05)] hover:from-[color:rgba(255,107,157,.15)] hover:to-[color:rgba(255,107,157,.08)] border-0' : 'border-2 border-[var(--brandPink)] bg-[var(--surface)] hover:shadow-md hover:-translate-y-0.5 hover:border-[var(--brandPink)]/90'}`}
                    onClick={() => nav.navigate('/requests')}>
                <CardHeader className="pb-3 px-4 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className={`text-xs font-semibold ${isEmployee ? 'text-[color:rgba(26,26,26,.5)]' : 'uppercase tracking-wider text-[var(--brandPink)]'}`}>
                      {isEmployee ? "My Requests" : "Pending Requests"}
                    </CardTitle>
                    {(isEmployee ? myPendingRequests : pendingRequests) > 0 && (
                      <span className="h-2 w-2 rounded-full bg-[var(--brandPink)] animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-end justify-between">
                    <div className={`font-bold text-[var(--text)] ${isEmployee ? 'text-2xl' : 'text-4xl'}`}>
                      {isEmployee ? myPendingRequests : pendingRequests}
                    </div>
                    <div className={`p-2.5 rounded-lg transition-transform duration-300 ${isEmployee ? 'bg-[var(--brandPink)]/20' : 'bg-[var(--brandPink)] group-hover:scale-105'}`}>
                      <FileText className={`h-5 w-5 ${isEmployee ? 'text-[var(--brandPink)]' : 'text-white'}`} />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* My Shifts / Upcoming Shifts */}
              <Card className={`group shadow-sm rounded-xl transition-all duration-300 animate-slide-up cursor-pointer ${isEmployee ? 'bg-gradient-to-br from-[color:rgba(142,213,226,.1)] to-[color:rgba(142,213,226,.05)] hover:from-[color:rgba(142,213,226,.15)] hover:to-[color:rgba(142,213,226,.08)] border-0' : 'border-2 border-[var(--brandBlue)] bg-[var(--surface)] hover:shadow-md hover:-translate-y-0.5 hover:border-[var(--brandBlue)]/90'}`}
                    onClick={() => nav.navigate('/schedule')}>
                <CardHeader className="pb-3 px-4 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className={`text-xs font-semibold ${isEmployee ? 'text-[color:rgba(26,26,26,.5)]' : 'uppercase tracking-wider text-[var(--brandBlue)]'}`}>
                      {isEmployee ? "My Shifts" : "Upcoming Shifts"}
                    </CardTitle>
                    {!isEmployee && <span className="h-2 w-2 rounded-full bg-[var(--brandBlue)]" />}
                  </div>
                  <div className="flex items-end justify-between">
                    <div className={`font-bold text-[var(--text)] ${isEmployee ? 'text-2xl' : 'text-4xl'}`}>
                      {isEmployee ? myUpcomingShifts.length : upcomingShifts}
                    </div>
                    <div className={`p-2.5 rounded-lg transition-transform duration-300 ${isEmployee ? 'bg-[color:rgba(142,213,226,.15)]' : 'bg-[var(--brandBlue)] group-hover:scale-105'}`}>
                      <Calendar className={`h-5 w-5 ${isEmployee ? 'text-[var(--brandBlue)]' : 'text-white'}`} />
                    </div>
                  </div>
                  {!isEmployee && (
                    <div className="mt-3 flex items-center text-xs text-[var(--brandBlue)] font-medium">
                      <ArrowRight className="h-3.5 w-3.5 mr-1 group-hover:translate-x-1 transition-transform duration-300" />
                      Manage schedule
                    </div>
                  )}
                </CardHeader>
              </Card>
            </div>

            {/* Bottom Section - Large Next Shift Card for Employees, Split for Admins */}
            <div className={`grid gap-6 ${isEmployee ? 'lg:grid-cols-1 max-w-4xl mx-auto' : 'lg:grid-cols-2'}`}>
              {/* Your Next Shift Card - Large and prominent for employees */}
              <Card className={`group rounded-2xl transition-all duration-300 animate-slide-up ${isEmployee ? 'bg-gradient-to-br from-[color:rgba(142,213,226,.08)] to-white border border-[color:rgba(142,213,226,.2)] hover:shadow-md shadow-sm' : 'border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:shadow hover:-translate-y-0.5 hover:border-[var(--brandBlue)]/40'}`}>
                <CardHeader className={`${isEmployee ? 'pb-6 px-8 pt-8' : 'pb-4'}`}>
                  <CardTitle className={`${isEmployee ? 'text-2xl' : 'text-lg'} font-bold text-[var(--text)] flex items-center gap-3 ${isEmployee ? 'mb-2' : ''}`}>
                    <div className={`${isEmployee ? 'p-3 rounded-xl' : 'p-2 rounded-lg'} bg-[color:rgba(142,213,226,.15)] ${isEmployee ? 'group-hover:bg-[color:rgba(142,213,226,.2)]' : 'group-hover:bg-[color:rgba(142,213,226,.2)]'} transition-colors duration-300`}>
                      <Calendar className={`${isEmployee ? 'h-6 w-6' : 'h-5 w-5'} text-[var(--brandBlue)]`} />
                    </div>
                    Your Next Shift
                  </CardTitle>
                  {isEmployee && (
                    <CardDescription className="text-[15px] text-[color:rgba(26,26,26,.6)] font-medium">
                      Your upcoming schedule
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className={isEmployee ? 'px-8 pb-8' : ''}>
                  {nextShift ? (
                    <div className={`${isEmployee ? 'grid md:grid-cols-3 gap-4' : 'space-y-3'}`}>
                      <div className={`flex ${isEmployee ? 'flex-col' : 'items-center justify-between'} ${isEmployee ? 'gap-2' : ''} p-${isEmployee ? '5' : '4'} bg-gradient-to-br from-[color:rgba(142,213,226,.12)] to-[color:rgba(142,213,226,.05)] ${isEmployee ? 'rounded-2xl' : 'rounded-xl'} border border-[color:rgba(142,213,226,.25)]`}>
                        <span className={`text-xs font-semibold text-[color:rgba(26,26,26,.6)] ${isEmployee ? 'mb-2' : ''}`}>Date</span>
                        <span className={`font-bold text-[var(--text)] ${isEmployee ? 'text-lg' : 'text-lg'}`}>
                          {new Date(nextShift.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className={`flex ${isEmployee ? 'flex-col' : 'items-center justify-between'} ${isEmployee ? 'gap-2' : ''} p-${isEmployee ? '5' : '4'} bg-gradient-to-br from-[color:rgba(142,213,226,.12)] to-[color:rgba(142,213,226,.05)] ${isEmployee ? 'rounded-2xl' : 'rounded-xl'} border border-[color:rgba(142,213,226,.25)]`}>
                        <span className={`text-xs font-semibold text-[color:rgba(26,26,26,.6)] ${isEmployee ? 'mb-2' : ''}`}>Time</span>
                        <span className={`font-bold text-[var(--text)] ${isEmployee ? 'text-lg' : 'text-lg'}`}>
                          {nextShift.startTime} - {nextShift.endTime}
                        </span>
                      </div>
                      <div className={`flex ${isEmployee ? 'flex-col' : 'items-center justify-between'} ${isEmployee ? 'gap-2' : ''} p-${isEmployee ? '5' : '4'} bg-gradient-to-br from-[color:rgba(142,213,226,.12)] to-[color:rgba(142,213,226,.05)] ${isEmployee ? 'rounded-2xl' : 'rounded-xl'} border border-[color:rgba(142,213,226,.25)]`}>
                        <span className={`text-xs font-semibold text-[color:rgba(26,26,26,.6)] ${isEmployee ? 'mb-2' : ''}`}>Role</span>
                        <span className={`font-bold text-[var(--text)] ${isEmployee ? 'text-lg' : 'text-lg'}`}>{nextShift.role}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`text-center ${isEmployee ? 'py-20' : 'py-16'} space-y-6`}>
                      <div className={`mx-auto ${isEmployee ? 'w-24 h-24' : 'w-20 h-20'} bg-gradient-to-br from-[color:rgba(142,213,226,.15)] to-[color:rgba(255,107,157,.1)] rounded-3xl flex items-center justify-center shadow-sm`}>
                        <Calendar className={`${isEmployee ? 'h-12 w-12' : 'h-10 w-10'} text-[color:rgba(142,213,226,.6)]`} />
                      </div>
                      <div className="space-y-3">
                        <h3 className={`${isEmployee ? 'text-2xl' : 'text-xl'} font-bold text-[var(--text)]`}>
                          {isEmployee ? "You're all clear! 🎉" : "No upcoming shifts"}
                        </h3>
                        <p className={`text-[${isEmployee ? '15px' : '14px'}] text-[color:rgba(26,26,26,.6)] max-w-md mx-auto leading-relaxed font-medium`}>
                          {isEmployee 
                            ? "No shifts scheduled yet. Check back soon or reach out to your manager if you have questions."
                            : "Ready to schedule your first shift? Let's get your schedule set up."
                          }
                        </p>
                      </div>
                      {!isEmployee && (
                        <Button
                          onClick={() => setIsShiftModalOpen(true)}
                          className="bg-[var(--brandBlue)] text-white hover:bg-[var(--brandBlue)]/90 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none transition-all duration-300"
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

              {/* Recent Activity Card - Hidden for employees */}
              {!isEmployee && (
                <Card className="group border border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl hover:shadow hover:-translate-y-0.5 hover:border-[var(--brandBlue)]/40 transition-all duration-300 animate-slide-up">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[color:rgba(59,175,218,.1)] group-hover:bg-[color:rgba(59,175,218,.15)] transition-colors duration-300">
                        <TrendingUp className="h-5 w-5 text-[var(--brandBlue)]" />
                      </div>
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Latest updates and changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      <div className="group/item flex items-start gap-3 p-3.5 rounded-lg bg-[color:rgba(249,165,184,.06)] border border-[color:rgba(249,165,184,.1)] hover:bg-[color:rgba(249,165,184,.1)] hover:border-[color:rgba(249,165,184,.15)] transition-all duration-300">
                        <div className="h-2 w-2 rounded-full mt-1.5 bg-[var(--brandPink)] flex-shrink-0 shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)]">New time-off request</p>
                          <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-0.5 leading-relaxed">
                            Chatcha requested time off for Jan 25-27
                          </p>
                        </div>
                      </div>
                      <div className="group/item flex items-start gap-3 p-3.5 rounded-lg bg-[color:rgba(59,175,218,.06)] border border-[color:rgba(59,175,218,.1)] hover:bg-[color:rgba(59,175,218,.1)] hover:border-[color:rgba(59,175,218,.15)] transition-all duration-300">
                        <div className="h-2 w-2 rounded-full mt-1.5 bg-[var(--brandBlue)] flex-shrink-0 shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)]">Schedule updated</p>
                          <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-0.5 leading-relaxed">5 new shifts added for next week</p>
                        </div>
                      </div>
                      <div className="group/item flex items-start gap-3 p-3.5 rounded-lg bg-[color:rgba(59,175,218,.06)] border border-[color:rgba(59,175,218,.1)] hover:bg-[color:rgba(59,175,218,.1)] hover:border-[color:rgba(59,175,218,.15)] transition-all duration-300">
                        <div className="h-2 w-2 rounded-full mt-1.5 bg-[var(--brandBlue)] flex-shrink-0 shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)]">Payroll processed</p>
                          <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-0.5 leading-relaxed">January payroll completed successfully</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

      <ShiftModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </AppLayout>
  )
}

