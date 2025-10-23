"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, DollarSign, Loader2 } from "lucide-react"
import { payrollData } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { exportPayrollCsv } from "@/lib/mock-api"

export default function PayrollPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (user && user.role !== "manager") {
      router.push("/unauthorized")
    }
  }, [user, router])

  if (user?.role !== "manager") {
    return null
  }

  const totalHours = payrollData.reduce((sum, entry) => sum + entry.hoursWorked, 0)
  const totalPayroll = payrollData.reduce((sum, entry) => sum + entry.totalPay, 0)

  const handleExportCSV = async () => {
    setIsExporting(true)

    try {
      await exportPayrollCsv(payrollData)

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll</h1>
          <p className="text-muted-foreground mt-1">Track hours and compensation for your team</p>
        </div>
        <Button
          type="button"
          onClick={handleExportCSV}
          disabled={isExporting}
          aria-busy={isExporting}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
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
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalHours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">This period</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">January 2025</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${Math.round(totalPayroll / payrollData.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per employee</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Payroll Summary - January 2025</CardTitle>
          <CardDescription>Detailed breakdown of hours worked and compensation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Employee</TableHead>
                <TableHead className="text-foreground">Role</TableHead>
                <TableHead className="text-foreground text-right">Hours Worked</TableHead>
                <TableHead className="text-foreground text-right">Hourly Rate</TableHead>
                <TableHead className="text-foreground text-right">Total Pay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((entry) => (
                <TableRow key={entry.id} className="transition-colors duration-200 hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium text-foreground">{entry.employeeName}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{entry.role}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-foreground">{entry.hoursWorked}h</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-muted-foreground">${entry.hourlyRate}/hr</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-foreground">${entry.totalPay.toLocaleString()}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 border-border bg-muted/30 font-semibold">
                <TableCell colSpan={2} className="text-foreground">
                  Total
                </TableCell>
                <TableCell className="text-right text-foreground">{totalHours}h</TableCell>
                <TableCell className="text-right text-muted-foreground">—</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-bold text-foreground">${totalPayroll.toLocaleString()}</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
