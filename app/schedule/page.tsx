"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown } from "lucide-react"
import { shifts, employees } from "@/lib/mock-data"
import { ShiftModal } from "@/components/shift-modal"

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<any>(null)
  const [dateRange, setDateRange] = useState("This week")

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
  const getShiftForDateAndEmployee = (date: Date, employeeId: number) => {
    const dateStr = date.toISOString().split("T")[0]
    return shifts.find((shift) => shift.date === dateStr && shift.employeeId === employeeId)
  }

  const handleAddShift = () => {
    setSelectedShift(null)
    setIsModalOpen(true)
  }

  const handleEditShift = (shift: any) => {
    setSelectedShift(shift)
    setIsModalOpen(true)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Header />

        <div className="p-8">
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
                    <div key={employee.id} className="grid grid-cols-8 gap-2 mb-3">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-sm text-[var(--text)]">{employee.name}</div>
                          <div className="text-xs text-[color:rgba(44,42,41,.6)]">{employee.role}</div>
                        </div>
                      </div>

                      {weekDates.map((date, idx) => {
                        const shift = getShiftForDateAndEmployee(date, employee.id)
                        return (
                          <div key={idx} className="min-h-[60px]">
                            {shift ? (
                              <button
                                type="button"
                                onClick={() => handleEditShift(shift)}
                                className="w-full h-full rounded-lg bg-[color:rgba(73,182,194,.1)] border border-[color:rgba(73,182,194,.2)] p-2 text-left transition-colors duration-200 hover:bg-[color:rgba(73,182,194,.2)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                                aria-label={`Edit shift for ${employee.name} on ${date.toLocaleDateString()}`}
                                data-testid={`shift-${employee.id}-${idx}`}
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
      </main>

      {/* Shift Modal */}
      <ShiftModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shift={selectedShift} />
    </div>
  )
}
