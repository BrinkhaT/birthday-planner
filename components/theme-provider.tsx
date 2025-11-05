"use client"

import { useEffect, useState } from "react"
import {
  ThemeContext,
  type Theme,
  type ThemePreference,
} from "@/lib/hooks/use-theme"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemePreference
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme-preference",
}: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(defaultTheme)
  const [systemPreference, setSystemPreference] = useState<Theme>("light")
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateSystemPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemPreference(e.matches ? "dark" : "light")
    }

    // Initial detection
    updateSystemPreference(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener("change", updateSystemPreference)

    return () => {
      mediaQuery.removeEventListener("change", updateSystemPreference)
    }
  }, [])

  // Load preference from storage on mount
  useEffect(() => {
    try {
      const storedPreference = localStorage.getItem(storageKey)
      if (
        storedPreference === "light" ||
        storedPreference === "dark" ||
        storedPreference === "system"
      ) {
        setPreference(storedPreference)
      }
    } catch (error) {
      // localStorage unavailable (private browsing, etc.)
      console.warn("Theme persistence unavailable:", error)
    }
    setMounted(true)
  }, [storageKey])

  // Compute and apply theme
  useEffect(() => {
    const computedTheme = preference === "system" ? systemPreference : preference
    setThemeState(computedTheme)

    // Apply to DOM
    const root = document.documentElement
    if (computedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [preference, systemPreference])

  const setTheme = (newPreference: ThemePreference) => {
    setPreference(newPreference)

    // Persist to storage
    try {
      localStorage.setItem(storageKey, newPreference)
    } catch (error) {
      console.warn("Failed to persist theme preference:", error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  // Prevent flash during hydration
  if (!mounted) {
    return null
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    systemPreference,
    preference,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
