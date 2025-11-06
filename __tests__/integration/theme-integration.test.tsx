/**
 * Integration tests for theme system
 * Tests end-to-end theme application including DOM manipulation
 */

import { render, waitFor, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "@/lib/hooks/use-theme"
import { ThemeToggle } from "@/components/theme-toggle"
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

describe("Theme Integration - Manual Toggle Flow (T024)", () => {
  it("should toggle theme from light to dark when clicking toggle button", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false) // Start with light

    render(
      <ThemeProvider>
        <ThemeToggle />
        <TestComponent />
      </ThemeProvider>
    )

    // Initial state: light mode
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })

    const themeDisplay = screen.getByTestId("current-theme")
    expect(themeDisplay.textContent).toBe("light")

    // Click toggle button
    const toggleButton = screen.getByRole("button")
    await user.click(toggleButton)

    // Should now be dark mode
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true)
      expect(themeDisplay.textContent).toBe("dark")
    })
  })

  it("should toggle theme from dark to light when clicking toggle button", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(true) // Start with dark

    render(
      <ThemeProvider>
        <ThemeToggle />
        <TestComponent />
      </ThemeProvider>
    )

    // Initial state: dark mode
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    const themeDisplay = screen.getByTestId("current-theme")
    expect(themeDisplay.textContent).toBe("dark")

    // Click toggle button
    const toggleButton = screen.getByRole("button")
    await user.click(toggleButton)

    // Should now be light mode
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false)
      expect(themeDisplay.textContent).toBe("light")
    })
  })

  it("should apply theme change to DOM immediately without page refresh", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // Initial: no dark class
    expect(document.documentElement.classList.contains("dark")).toBe(false)

    // Toggle to dark
    await user.click(toggleButton)

    // Should update DOM immediately (no delay)
    await waitFor(
      () => {
        expect(document.documentElement.classList.contains("dark")).toBe(true)
      },
      { timeout: 100 }
    ) // Should be instant (< 100ms)

    // Toggle back to light
    await user.click(toggleButton)

    await waitFor(
      () => {
        expect(document.documentElement.classList.contains("dark")).toBe(false)
      },
      { timeout: 100 }
    )
  })

  it("should persist manual theme selection to localStorage", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // Toggle to dark
    await user.click(toggleButton)

    await waitFor(() => {
      expect(localStorageMock.getItem("theme-preference")).toBe("dark")
    })

    // Toggle back to light
    await user.click(toggleButton)

    await waitFor(() => {
      expect(localStorageMock.getItem("theme-preference")).toBe("light")
    })
  })

  it("should update all components when theme is toggled", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false)

    const { getAllByTestId } = render(
      <ThemeProvider>
        <ThemeToggle />
        <TestComponent />
        <TestComponent />
        <TestComponent />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // Toggle to dark
    await user.click(toggleButton)

    await waitFor(() => {
      const themeDisplays = getAllByTestId("current-theme")
      themeDisplays.forEach((display) => {
        expect(display.textContent).toBe("dark")
      })
    })
  })
})

describe("Theme Integration - Persistence (T035, T036)", () => {
  it("T035: should persist theme across simulated page reload", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false) // system is light

    // First "session" - user manually sets dark theme
    const { unmount } = render(
      <ThemeProvider>
        <ThemeToggle />
        <TestComponent />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")
    await user.click(toggleButton)

    await waitFor(() => {
      expect(localStorageMock.getItem("theme-preference")).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    // Unmount to simulate page navigation/close
    unmount()
    document.documentElement.classList.remove("dark")

    // Second "session" - user returns to app (new render)
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      const themeDisplay = screen.getByTestId("current-theme")
      // Should restore dark theme from localStorage
      expect(themeDisplay.textContent).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  it("T035: should persist 'light' selection across page reload when system is dark", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(true) // system is dark

    // First session
    const { unmount } = render(
      <ThemeProvider>
        <ThemeToggle />
        <TestComponent />
      </ThemeProvider>
    )

    // User is in dark mode (system default)
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    // User manually switches to light
    const toggleButton = screen.getByRole("button")
    await user.click(toggleButton)

    await waitFor(() => {
      expect(localStorageMock.getItem("theme-preference")).toBe("light")
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })

    // Simulate reload
    unmount()
    document.documentElement.classList.add("dark") // Reset to dark

    // Second session
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      // Should restore light theme despite system being dark
      expect(screen.getByTestId("current-theme").textContent).toBe("light")
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })
  })

  it("T036: should prioritize manual selection over system preference", async () => {
    setupMatchMediaMock(false) // system is light

    // User manually selected dark mode previously
    localStorageMock.setItem("theme-preference", "dark")

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      const themeDisplay = screen.getByTestId("current-theme")
      const systemDisplay = screen.getByTestId("system-preference")

      // System says light
      expect(systemDisplay.textContent).toBe("light")

      // But app uses dark (manual selection wins)
      expect(themeDisplay.textContent).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  it("T036: manual selection should prevent system preference changes from affecting theme", async () => {
    const { triggerChange } = setupMatchMediaMock(false) // system starts light

    // User manually selected light mode
    localStorageMock.setItem("theme-preference", "light")

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })

    // System preference changes to dark
    triggerChange(true)

    await waitFor(() => {
      const systemDisplay = screen.getByTestId("system-preference")
      const themeDisplay = screen.getByTestId("current-theme")

      // System preference should update
      expect(systemDisplay.textContent).toBe("dark")

      // But theme should stay light (manual selection priority)
      expect(themeDisplay.textContent).toBe("light")
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })
  })

  it("T036: should follow system preference changes only when preference is 'system'", async () => {
    const { triggerChange } = setupMatchMediaMock(false) // system starts light

    // User explicitly wants system preference
    localStorageMock.setItem("theme-preference", "system")

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("current-theme").textContent).toBe("light")
    })

    // System changes to dark
    triggerChange(true)

    await waitFor(() => {
      // Theme should follow system change
      expect(screen.getByTestId("current-theme").textContent).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })
})

describe("Theme Integration - Toggle Accessibility (T025)", () => {
  it("should be keyboard navigable with Tab key", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // Tab to button
    await user.tab()

    // Button should be focused
    expect(toggleButton).toHaveFocus()
  })

  it("should toggle theme when pressing Enter key", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // Focus button
    await user.tab()
    expect(toggleButton).toHaveFocus()

    // Press Enter
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  it("should toggle theme when pressing Space key", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // Focus button
    await user.tab()
    expect(toggleButton).toHaveFocus()

    // Press Space
    await user.keyboard(" ")

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  it("should have proper ARIA label that changes based on theme", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // In light mode: "switch to dark mode"
    expect(toggleButton).toHaveAttribute(
      "aria-label",
      "Zu dunklem Modus wechseln"
    )

    // Toggle to dark
    await user.click(toggleButton)

    await waitFor(() => {
      // In dark mode: "switch to light mode"
      expect(toggleButton).toHaveAttribute(
        "aria-label",
        "Zu hellem Modus wechseln"
      )
    })
  })

  it("should be accessible by screen readers", async () => {
    setupMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // Button should have accessible name via aria-label
    expect(toggleButton).toHaveAccessibleName("Zu dunklem Modus wechseln")

    // Button should be discoverable by role
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("should maintain focus after toggle", async () => {
    const user = userEvent.setup()
    setupMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole("button")

    // Focus and click
    await user.tab()
    await user.click(toggleButton)

    // Focus should remain on button after toggle
    expect(toggleButton).toHaveFocus()
  })
})
