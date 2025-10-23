"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown } from "lucide-react"
import { ShiftModal } from "@/components/features/shifts/shift-modal"
import apiClient from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"

export default function SchedulePage() {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<any>(null)
  const [dateRange, setDateRange] = useState("This week")
  const [employees, setEmployees] = useState([])
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [employeesRes, shiftsRes] = await Promise.all([
          apiClient.getEmployees(),
          apiClient.getShifts()
        ])
        
        if (employeesRes.success) setEmployees(employeesRes.data || [])
        if (shiftsRes.success) setShifts(shiftsRes.data || [])
      } catch (error) {
        console.error('Error fetching schedule data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Get current week dates
  const getWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) // Adjust to Monday
    const monday = new Date(today.setDate(diff))

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const weekDates = getWeekDates()

  // Group shifts by date and employee
  const getShiftForDateAndEmployee = (date: Date, employeeId: string) => {
    const dateStr = date.toISOString().split("T")[0]
    return shifts.find((shift) => shift.date === dateStr && shift.employee === employeeId)
  }

  const handleAddShift = () => {
    setSelectedShift(null)
    setIsModalOpen(true)
  }

  const handleEditShift = (shift: any) => {
    setSelectedShift(shift)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-2 text-[color:rgba(44,42,41,.6)]">Loading schedule...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Weekly Schedule</h1>
            <p className="text-[color:rgba(44,42,41,.6)] mt-1">Manage shifts and team availability</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-[var(--border)] text-[var(--text)] hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none bg-transparent"
              data-testid="date-range-selector"
            >
              {dateRange} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={handleAddShift}
              className="bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
              data-testid="add-shift-button"
              aria-label="Add new shift"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Shift
            </Button>
          </div>
        </div>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">
              Week of {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            </CardTitle>
            <CardDescription>Click on a shift to edit or remove it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="font-semibold text-sm text-[color:rgba(44,42,41,.7)]">Employee</div>
                  {weekDates.map((date, idx) => (
                    <div key={idx} className="text-center">
                      <div className="font-semibold text-sm text-[var(--text)]">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-xs text-[color:rgba(44,42,41,.6)]">{date.getDate()}</div>
                    </div>
                  ))}
                </div>

                {employees.map((employee) => (
                  <div key={employee._id} className="grid grid-cols-8 gap-2 mb-3">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-sm text-[var(--text)]">{employee.name}</div>
                        <div className="text-xs text-[color:rgba(44,42,41,.6)]">{employee.role}</div>
                      </div>
                    </div>

                    {weekDates.map((date, idx) => {
                      const shift = getShiftForDateAndEmployee(date, employee._id)
                      return (
                        <div key={idx} className="min-h-[60px]">
                          {shift ? (
                            <button
                              type="button"
                              onClick={() => handleEditShift(shift)}
                              className="w-full h-full rounded-lg bg-[color:rgba(73,182,194,.1)] border border-[color:rgba(73,182,194,.2)] p-2 text-left transition-colors duration-200 hover:bg-[color:rgba(73,182,194,.2)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                              aria-label={`Edit shift for ${employee.name} on ${date.toLocaleDateString()}`}
                              data-testid={`shift-${employee._id}-${idx}`}
                            >
                              <div className="text-xs font-medium text-[var(--text)]">
                                {shift.startTime} - {shift.endTime}
                              </div>
                              <div className="text-xs text-[color:rgba(44,42,41,.6)] mt-0.5">{shift.role}</div>
                            </button>
                          ) : (
                            <div className="w-full h-full rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)]/30" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {shifts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[color:rgba(44,42,41,.7)]">No shifts scheduled yet — add one above!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Shift Modal */}
      <ShiftModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shift={selectedShift} />
    </AppLayout>
  )
}
