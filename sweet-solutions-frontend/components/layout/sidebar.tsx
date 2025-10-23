"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Users, DollarSign, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { useNav } from "@/lib/utils/navigation"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["manager", "employee"], section: "Overview" },
  { name: "Schedule", href: "/schedule", icon: Calendar, roles: ["manager", "employee"], section: "Team" },
  { name: "Employees", href: "/employees", icon: Users, roles: ["manager", "employee"], section: "Team" },
  { name: "Requests", href: "/requests", icon: FileText, roles: ["manager", "employee"], section: "Team" },
  { name: "Payroll", href: "/payroll", icon: DollarSign, roles: ["manager"], section: "Finance" },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["manager"], section: "System" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const nav = useNav()

  const visibleNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  const sections = visibleNavigation.reduce(
    (acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = []
      }
      acc[item.section].push(item)
      return acc
    },
    {} as Record<string, typeof navigation>,
  )

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-[var(--border)] px-6">
          <h1 className="text-xl font-semibold text-[var(--text)]">Sweet Solutions</h1>
        </div>

        <nav className="flex-1 space-y-6 px-3 py-4">
          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName}>
              <div className="px-3 mb-2 mt-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:rgba(44,42,41,.5)]">
                  {sectionName}
                </p>
              </div>
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none",
                        isActive
                          ? "bg-[var(--brandBlue)] text-white hover:bg-[color:rgba(73,182,194,.9)] shadow-md before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-[var(--brandPink)] before:rounded-l-lg after:absolute after:right-3 after:top-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:bg-white after:rounded-full"
                          : "text-[var(--text)] hover:bg-[var(--muted)] hover:translate-x-1 hover:border-l-2 hover:border-[var(--brandBlue)]",
                      )}
                      data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <item.icon className="h-5 w-5 transition-colors duration-200" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[var(--border)] p-4 pt-3">
          <p className="text-xs font-medium text-[var(--brandBlue)]">Howdy Homemade Ice Cream</p>
        </div>
      </div>
    </aside>
  )
}
