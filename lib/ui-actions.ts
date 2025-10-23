"use client"
import { useRouter } from "next/navigation"

export function useNav() {
  const r = useRouter()
  return {
    toDashboard: () => r.push("/"),
    toSchedule: () => r.push("/schedule"),
    toEmployees: () => r.push("/employees"),
    toRequests: () => r.push("/requests"),
    toPayroll: () => r.push("/payroll"),
    toSettings: () => r.push("/settings"),
    toLogin: () => r.push("/login"),
  }
}
