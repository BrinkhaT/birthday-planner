"use client"

import { useEffect, useState, useMemo } from "react"
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

// Helper to get initial preference from storage
function getInitialPreference(storageKey: string, defaultTheme: ThemePreference): ThemePreference {
  if (typeof window === "undefined") return defaultTheme

  try {
    const storedPreference = localStorage.getItem(storageKey)
    if (
      storedPreference === "light" ||
      storedPreference === "dark" ||
      storedPreference === "system"
    ) {
      return storedPreference
    }
  } catch {
    // localStorage unavailable
  }
  return defaultTheme
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme-preference",
}: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(() =>
    getInitialPreference(storageKey, defaultTheme)
  )
  const [systemPreference, setSystemPreference] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Compute theme from preference and system preference
  const theme = useMemo(
    () => (preference === "system" ? systemPreference : preference),
    [preference, systemPreference]
  )

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

  // Mark as mounted after hydration
  useEffect(() => {
    // Intentional: prevents hydration mismatch by delaying render until client-side
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

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
