/**
 * Integration tests for theme system
 * Tests end-to-end theme application including DOM manipulation
 */

import { render, waitFor } from "@testing-library/react"
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
  document.documentElement.classList.remove("dark")
})

// Test component that uses theme
function TestComponent() {
  const { theme, systemPreference } = useTheme()
  return (
    <div data-testid="theme-display">
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="system-preference">{systemPreference}</span>
    </div>
  )
}

describe("Theme Integration - System Preference Application", () => {
  it("should apply light theme to DOM when system preference is light", async () => {
    setupMatchMediaMock(false) // light mode

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })
  })

  it("should apply dark theme to DOM when system preference is dark", async () => {
    setupMatchMediaMock(true) // dark mode

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  it("should update DOM when system preference changes", async () => {
    const { triggerChange } = setupMatchMediaMock(false) // Start with light

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })

    // Simulate system change to dark
    triggerChange(true)

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  it("should respect stored preference over system preference", async () => {
    setupMatchMediaMock(false) // system is light
    localStorageMock.setItem("theme-preference", "dark") // but user wants dark

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      // Should apply dark theme despite system being light
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  it("should not update DOM when system changes if user has manual preference", async () => {
    const { triggerChange } = setupMatchMediaMock(false) // system is light
    localStorageMock.setItem("theme-preference", "light") // user explicitly chose light

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })

    // System changes to dark, but user preference should take precedence
    triggerChange(true)

    await waitFor(() => {
      // Should still be light (user's choice)
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })
  })
})

describe("Theme Integration - Page Load Scenarios", () => {
  it("should apply theme before component renders (no flash)", async () => {
    setupMatchMediaMock(true) // dark mode

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Theme should be applied immediately
    await waitFor(() => {
      const themeDisplay = getByTestId("current-theme")
      expect(themeDisplay.textContent).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  it("should handle multiple components consuming theme context", async () => {
    setupMatchMediaMock(false)

    const { getAllByTestId } = render(
      <ThemeProvider>
        <TestComponent />
        <TestComponent />
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      const themeDisplays = getAllByTestId("current-theme")
      themeDisplays.forEach((display) => {
        expect(display.textContent).toBe("light")
      })
    })
  })
})
