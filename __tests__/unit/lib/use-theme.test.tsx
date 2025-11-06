/**
 * Unit tests for useTheme hook
 * Tests system preference detection, theme state management, and localStorage persistence
 */

import React from "react"
import { renderHook, act, waitFor } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "@/lib/hooks/use-theme"
import { localStorageMock } from "@/__tests__/mocks/localStorage"
import { setupMatchMediaMock } from "@/__tests__/mocks/matchMedia"

// Setup mocks
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  })
})

beforeEach(() => {
  localStorageMock.clear()
  jest.clearAllMocks()
})

describe("useTheme hook - System Preference Detection", () => {
  it("should detect light mode when system preference is light", async () => {
    setupMatchMediaMock(false) // false = light mode

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.systemPreference).toBe("light")
      expect(result.current.theme).toBe("light")
    })
  })

  it("should detect dark mode when system preference is dark", async () => {
    setupMatchMediaMock(true) // true = dark mode

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.systemPreference).toBe("dark")
      expect(result.current.theme).toBe("dark")
    })
  })

  it("should default to light theme when no preference is set", async () => {
    setupMatchMediaMock(false) // no preference = light

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.theme).toBe("light")
    })
  })

  it("should update theme when system preference changes", async () => {
    const { triggerChange } = setupMatchMediaMock(false) // Start with light

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.theme).toBe("light")
    })

    // Simulate system preference change to dark
    act(() => {
      triggerChange(true)
    })

    await waitFor(() => {
      expect(result.current.systemPreference).toBe("dark")
      expect(result.current.theme).toBe("dark")
    })
  })
})

describe("useTheme hook - Initialization", () => {
  it("should initialize with system preference when no stored preference exists", async () => {
    setupMatchMediaMock(true) // dark mode

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.preference).toBe("system")
      expect(result.current.theme).toBe("dark")
    })
  })

  it("should load stored preference from localStorage on initialization", async () => {
    setupMatchMediaMock(false) // system is light
    localStorageMock.setItem("theme-preference", "dark") // but user prefers dark

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.preference).toBe("dark")
      expect(result.current.theme).toBe("dark") // Uses stored preference, not system
    })
  })

  it("should handle invalid stored preference gracefully", async () => {
    setupMatchMediaMock(false)
    localStorageMock.setItem("theme-preference", "invalid")

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      // Should ignore invalid value and use system preference
      expect(result.current.preference).toBe("system")
      expect(result.current.theme).toBe("light")
    })
  })

  it("should handle localStorage unavailable gracefully", async () => {
    setupMatchMediaMock(true)

    // Mock localStorage to throw error
    const originalGetItem = localStorageMock.getItem
    localStorageMock.getItem = jest.fn(() => {
      throw new Error("localStorage unavailable")
    })

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      // Should continue with system preference
      expect(result.current.theme).toBe("dark")
    })

    // Restore
    localStorageMock.getItem = originalGetItem
  })

  it("should throw error when used outside ThemeProvider", () => {
    expect(() => {
      renderHook(() => useTheme())
    }).toThrow("useTheme must be used within ThemeProvider")
  })
})

describe("useTheme hook - Theme Computation", () => {
  it('should use system preference when preference is "system"', async () => {
    setupMatchMediaMock(true) // system is dark

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.preference).toBe("system")
      expect(result.current.theme).toBe("dark")
    })
  })

  it('should use stored preference when preference is "light" regardless of system', async () => {
    setupMatchMediaMock(true) // system is dark
    localStorageMock.setItem("theme-preference", "light") // but user wants light

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.preference).toBe("light")
      expect(result.current.theme).toBe("light") // Override system
    })
  })

  it('should use stored preference when preference is "dark" regardless of system', async () => {
    setupMatchMediaMock(false) // system is light
    localStorageMock.setItem("theme-preference", "dark") // but user wants dark

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.preference).toBe("dark")
      expect(result.current.theme).toBe("dark") // Override system
    })
  })
})

describe("useTheme hook - localStorage Persistence (T032, T033)", () => {
  it("T032: should write to localStorage when theme changes via setTheme", async () => {
    setupMatchMediaMock(false) // system is light

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    // Initial state - no manual preference set
    expect(localStorageMock.getItem("theme-preference")).toBeNull()

    // Change theme manually
    await act(async () => {
      result.current.setTheme("dark")
    })

    await waitFor(() => {
      // Should persist to localStorage
      expect(localStorageMock.getItem("theme-preference")).toBe("dark")
    })

    // Change again
    await act(async () => {
      result.current.setTheme("light")
    })

    await waitFor(() => {
      expect(localStorageMock.getItem("theme-preference")).toBe("light")
    })

    // Set to system
    await act(async () => {
      result.current.setTheme("system")
    })

    await waitFor(() => {
      expect(localStorageMock.getItem("theme-preference")).toBe("system")
    })
  })

  it("T033: should read from localStorage on initialization and apply preference", async () => {
    setupMatchMediaMock(false) // system is light

    // Set stored preference before initialization
    localStorageMock.setItem("theme-preference", "dark")

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      // Should load and apply stored preference
      expect(result.current.preference).toBe("dark")
      expect(result.current.theme).toBe("dark")
    })
  })

  it("T033: should read 'system' preference from localStorage correctly", async () => {
    setupMatchMediaMock(true) // system is dark

    // User explicitly set "system" preference
    localStorageMock.setItem("theme-preference", "system")

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    await waitFor(() => {
      expect(result.current.preference).toBe("system")
      expect(result.current.theme).toBe("dark") // Should follow system
    })
  })

  it("T034: should handle localStorage write errors gracefully", async () => {
    setupMatchMediaMock(false)

    // Mock localStorage.setItem to throw error
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation()
    const originalSetItem = localStorageMock.setItem
    localStorageMock.setItem = jest.fn(() => {
      throw new Error("QuotaExceededError")
    })

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    })

    // Should not crash when localStorage write fails
    await act(async () => {
      result.current.setTheme("dark")
    })

    await waitFor(() => {
      // Theme should still change in memory
      expect(result.current.theme).toBe("dark")
      // Should log warning
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to persist theme preference:",
        expect.any(Error)
      )
    })

    // Cleanup
    localStorageMock.setItem = originalSetItem
    consoleWarnSpy.mockRestore()
  })
})
