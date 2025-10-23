"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

export type UserRole = "manager" | "employee"

export interface User {
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for login
const DEMO_USERS = [
  { email: "mari.lisa@example.com", password: "demo123", name: "Mari Lisa", role: "manager" as UserRole },
  { email: "justin.tan@example.com", password: "demo123", name: "Justin Tan", role: "employee" as UserRole },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("sweet-solutions-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Redirect logic
  useEffect(() => {
    if (isLoading) return

    // If not logged in and not on login page, redirect to login
    if (!user && pathname !== "/login") {
      router.push("/login")
    }

    // If logged in and on login page, redirect to dashboard
    if (user && pathname === "/login") {
      router.push("/")
    }
  }, [user, pathname, router, isLoading])

  const login = (email: string, password: string): boolean => {
    const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password)
    if (demoUser) {
      const user: User = {
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
      }
      setUser(user)
      localStorage.setItem("sweet-solutions-user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sweet-solutions-user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
