"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Theme, ThemeName, themes, playfulLocalTheme } from "./theme"

interface ThemeContextType {
  currentTheme: Theme
  themeName: ThemeName
  toggleTheme: () => void
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>("playful")
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeName | null
    if (savedTheme && (savedTheme === "playful" || savedTheme === "modern")) {
      setThemeNameState(savedTheme)
    }
    setMounted(true)
  }, [])

  const currentTheme = themes[themeName]

  const setTheme = (theme: ThemeName) => {
    setThemeNameState(theme)
    localStorage.setItem("theme", theme)
  }

  const toggleTheme = () => {
    const newTheme = themeName === "playful" ? "modern" : "playful"
    setTheme(newTheme)
  }

  // Apply theme on mount and theme change
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement
      root.style.setProperty("--current-sidebar-bg", currentTheme.sidebarBackground)
      root.style.setProperty("--current-header-bg", currentTheme.headerBackground)
      root.style.setProperty("--current-main-bg", currentTheme.mainBackground)
      root.style.setProperty("--current-card-bg", currentTheme.cardBackground)
      root.style.setProperty("--current-card-border", currentTheme.cardBorder)
      root.style.setProperty("--current-shadow", currentTheme.shadow)
      root.style.setProperty("--current-text", currentTheme.textPrimary)
      root.style.setProperty("--current-accent", currentTheme.accentPrimary)
      root.style.setProperty("--current-accent-secondary", currentTheme.accentSecondary)
      root.style.setProperty("--current-button-bg", currentTheme.buttonStyle.background)
      root.style.setProperty("--current-button-color", currentTheme.buttonStyle.color)
      root.style.setProperty("--current-button-radius", currentTheme.buttonStyle.borderRadius)
    }
  }, [currentTheme, mounted])

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, themeName, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
