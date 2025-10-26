"use client"

import { Sun, Moon } from "lucide-react"
import { Button } from "./button"
import { useTheme } from "@/lib/theme-context"

export function ThemeToggle() {
  const { themeName, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg"
      aria-label="Toggle theme"
    >
      {themeName === "playful" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
