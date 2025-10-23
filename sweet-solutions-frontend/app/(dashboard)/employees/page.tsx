"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Clock } from "lucide-react"
import apiClient from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"

export default function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getEmployees()
        if (response.success) {
          setEmployees(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [user])
  const getRoleBadgeVariant = (role: string) => {
    if (role.includes("Manager")) return "default"
    if (role.includes("Lead")) return "secondary"
    return "outline"
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-2 text-[color:rgba(44,42,41,.6)]">Loading employees...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)]">Team Members</h1>
          <p className="text-[color:rgba(44,42,41,.6)] mt-1">Manage your staff and their information</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{employees.length}</div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Average Hours/Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                {Math.round(employees.reduce((sum, emp) => sum + (emp.hoursPerWeek || 0), 0) / employees.length)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Management Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                {employees.filter((emp) => emp.role.includes("Manager")).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Table */}
        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">Staff Directory</CardTitle>
            <CardDescription>Contact information and weekly hours for all team members</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[var(--text)]">Name</TableHead>
                  <TableHead className="text-[var(--text)]">Role</TableHead>
                  <TableHead className="text-[var(--text)]">Contact</TableHead>
                  <TableHead className="text-[var(--text)] text-right">Weekly Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id} className="transition-colors duration-200 hover:bg-[var(--muted)]/50">
                    <TableCell>
                      <div className="font-medium text-[var(--text)]">{employee.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(employee.role)} className="font-normal">
                        {employee.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {employee.email && (
                          <div className="flex items-center gap-2 text-sm text-[color:rgba(44,42,41,.6)]">
                            <Mail className="h-3.5 w-3.5" />
                            {employee.email}
                          </div>
                        )}
                        {employee.phone && (
                          <div className="flex items-center gap-2 text-sm text-[color:rgba(44,42,41,.6)]">
                            <Phone className="h-3.5 w-3.5" />
                            {employee.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Clock className="h-4 w-4 text-[color:rgba(44,42,41,.6)]" />
                        <span className="font-medium text-[var(--text)]">{employee.hoursPerWeek}h</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
