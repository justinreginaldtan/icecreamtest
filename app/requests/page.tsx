"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Calendar, Loader2 } from "lucide-react"
import { timeOffRequests } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { approveRequest, denyRequest } from "@/lib/mock-api"

export default function RequestsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState(timeOffRequests)
  const [loadingRequests, setLoadingRequests] = useState<Record<number, "approve" | "deny" | null>>({})

  const handleApprove = async (requestId: number) => {
    setLoadingRequests((prev) => ({ ...prev, [requestId]: "approve" }))

    try {
      await approveRequest(requestId.toString())

      setRequests(requests.map((req) => (req.id === requestId ? { ...req, status: "approved" as const } : req)))

      toast({
        title: "Request approved",
        description: "The time-off request has been approved successfully.",
        className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request.",
        variant: "destructive",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [requestId]: null }))
    }
  }

  const handleDeny = async (requestId: number) => {
    setLoadingRequests((prev) => ({ ...prev, [requestId]: "deny" }))

    try {
      await denyRequest(requestId.toString())

      setRequests(requests.map((req) => (req.id === requestId ? { ...req, status: "denied" as const } : req)))

      toast({
        title: "Request denied",
        description: "The time-off request has been denied.",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deny request.",
        variant: "destructive",
      })
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [requestId]: null }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Approved</Badge>
      case "denied":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Denied</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Pending</Badge>
    }
  }

  const pendingCount = requests.filter((req) => req.status === "pending").length
  const approvedCount = requests.filter((req) => req.status === "approved").length

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Header />

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Time-Off Requests</h1>
            <p className="text-muted-foreground mt-1">Review and manage employee time-off requests</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{approvedCount}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{requests.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">All Requests</CardTitle>
              <CardDescription>Review and take action on time-off requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => {
                  const isLoading = loadingRequests[request.id]
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors duration-200 hover:bg-muted/30"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{request.employeeName}</h3>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(request.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(request.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Reason:</span> {request.reason}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted on{" "}
                          {new Date(request.submittedDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {request.status === "pending" && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            disabled={!!isLoading}
                            aria-busy={isLoading === "approve"}
                            className="bg-green-600 text-white hover:bg-green-700"
                            data-testid={`approve-request-${request.id}`}
                          >
                            {isLoading === "approve" ? (
                              <>
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <Check className="mr-1 h-4 w-4" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeny(request.id)}
                            disabled={!!isLoading}
                            aria-busy={isLoading === "deny"}
                            className="bg-red-600 text-white hover:bg-red-700"
                            data-testid={`deny-request-${request.id}`}
                          >
                            {isLoading === "deny" ? (
                              <>
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                Denying...
                              </>
                            ) : (
                              <>
                                <X className="mr-1 h-4 w-4" />
                                Deny
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}

                {requests.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No time-off requests at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
