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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 shadow-lg border-r border-[color:rgba(0,0,0,0.05)]" style={{ backgroundColor: '#E5F7F8' }}>
      <div className="flex h-full flex-col">
        {/* Navigation Content */}
        <nav className="flex-1 space-y-8 px-4 py-6">
          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName}>
              <div className="px-3 mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:rgba(44,42,41,.6)]">
                  {sectionName}
                </p>
              </div>
              <div className="space-y-2">
                {items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none",
                        isActive
                          ? "bg-[var(--brandBlue)] text-white shadow-md hover:bg-[color:rgba(59,175,218,.9)]"
                          : "text-[color:rgba(44,42,41,.7)] hover:bg-[color:rgba(59,175,218,.05)] hover:text-[var(--text)]",
                      )}
                      data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        isActive ? "text-white" : "text-[color:rgba(44,42,41,.6)]"
                      )} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3 px-3">
            <img 
              src="/howdyslogo.png" 
              alt="Howdy Homemade Logo" 
              className="h-6 w-6 object-contain"
            />
            <div>
              <p className="text-xs font-medium text-[var(--brandBlue)]">Howdy Homemade</p>
              <p className="text-xs font-medium text-[var(--brandPink)]">Sweet Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
