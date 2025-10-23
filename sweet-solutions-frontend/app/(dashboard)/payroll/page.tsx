"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, DollarSign, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api/client"

export default function PayrollPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [payrollData, setPayrollData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "manager") {
      router.push("/unauthorized")
    }
  }, [user, router])

  useEffect(() => {
    if (!user || user.role !== "manager") return

    const fetchPayroll = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getPayroll()
        if (response.success) {
          setPayrollData(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching payroll:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayroll()
  }, [user])

  if (user?.role !== "manager") {
    return null
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-2 text-[color:rgba(44,42,41,.6)]">Loading payroll...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  const totalHours = payrollData.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0)
  const totalPayroll = payrollData.reduce((sum, entry) => sum + (entry.netPay || 0), 0)

  const handleExportCSV = async () => {
    setIsExporting(true)

    try {
      await apiClient.exportPayroll()

      toast({
        title: "Export complete",
        description: "payroll.csv downloaded successfully.",
        className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export payroll data.",
        variant: "destructive",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Payroll</h1>
            <p className="text-[color:rgba(44,42,41,.6)] mt-1">Track hours and compensation for your team</p>
          </div>
          <Button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            aria-busy={isExporting}
            className="bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
            data-testid="export-csv-button"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{totalHours.toLocaleString()}</div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">This period</p>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Total Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">${totalPayroll.toLocaleString()}</div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">January 2025</p>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Average Pay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                ${Math.round(totalPayroll / payrollData.length).toLocaleString()}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Per employee</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">Payroll Summary - January 2025</CardTitle>
            <CardDescription>Detailed breakdown of hours worked and compensation</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[var(--text)]">Employee</TableHead>
                  <TableHead className="text-[var(--text)]">Role</TableHead>
                  <TableHead className="text-[var(--text)] text-right">Hours Worked</TableHead>
                  <TableHead className="text-[var(--text)] text-right">Hourly Rate</TableHead>
                  <TableHead className="text-[var(--text)] text-right">Total Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((entry) => (
                  <TableRow key={entry.id} className="transition-colors duration-200 hover:bg-[var(--muted)]/50">
                    <TableCell>
                      <div className="font-medium text-[var(--text)]">{entry.employeeName}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[color:rgba(44,42,41,.6)]">{entry.role}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-[var(--text)]">{entry.hoursWorked}h</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-[color:rgba(44,42,41,.6)]">${entry.hourlyRate}/hr</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DollarSign className="h-4 w-4 text-[var(--primary)]" />
                        <span className="font-semibold text-[var(--text)]">${entry.totalPay.toLocaleString()}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 border-[var(--border)] bg-[var(--muted)]/30 font-semibold">
                  <TableCell colSpan={2} className="text-[var(--text)]">
                    Total
                  </TableCell>
                  <TableCell className="text-right text-[var(--text)]">{totalHours}h</TableCell>
                  <TableCell className="text-right text-[color:rgba(44,42,41,.6)]">—</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DollarSign className="h-4 w-4 text-[var(--primary)]" />
                      <span className="font-bold text-[var(--text)]">${totalPayroll.toLocaleString()}</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
