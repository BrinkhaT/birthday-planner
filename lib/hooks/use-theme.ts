"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type ThemePreference = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: ThemePreference) => void
  toggleTheme: () => void
  systemPreference: Theme
  preference: ThemePreference
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

export { ThemeContext, type Theme, type ThemePreference, type ThemeContextValue }
