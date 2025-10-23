"use client"

import type React from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="text-[color:rgba(44,42,41,.6)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
