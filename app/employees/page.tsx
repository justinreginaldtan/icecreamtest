import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Clock } from "lucide-react"
import { employees } from "@/lib/mock-data"

export default function EmployeesPage() {
  // TODO: Replace with live data from AWS API Gateway

  const getRoleBadgeVariant = (role: string) => {
    if (role.includes("Manager")) return "default"
    if (role.includes("Lead")) return "secondary"
    return "outline"
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Header />

        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground mt-1">Manage your staff and their information</p>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{employees.length}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Hours/Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {Math.round(employees.reduce((sum, emp) => sum + emp.hours, 0) / employees.length)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Management Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {employees.filter((emp) => emp.role.includes("Manager")).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Table */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Staff Directory</CardTitle>
              <CardDescription>Contact information and weekly hours for all team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Name</TableHead>
                    <TableHead className="text-foreground">Role</TableHead>
                    <TableHead className="text-foreground">Contact</TableHead>
                    <TableHead className="text-foreground text-right">Weekly Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} className="transition-colors duration-200 hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium text-foreground">{employee.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(employee.role)} className="font-normal">
                          {employee.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {employee.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" />
                              {employee.email}
                            </div>
                          )}
                          {employee.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              {employee.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{employee.hours}h</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
