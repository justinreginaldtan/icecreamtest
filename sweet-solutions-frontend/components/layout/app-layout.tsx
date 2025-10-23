"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="text-[color:rgba(44,42,41,.6)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex flex-1 flex-col lg:pl-64">
        <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
