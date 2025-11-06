"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/hooks/use-theme"
import { i18nDE } from "@/lib/i18n-de"

/**
 * ThemeToggle component
 * A button that toggles between light and dark mode
 * Uses ShadCN Button with Lucide icons for visual clarity
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? i18nDE.theme.toggleLight
          : i18nDE.theme.toggleDark
      }
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}
