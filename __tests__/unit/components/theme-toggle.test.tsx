/**
 * Unit tests for ThemeToggle component
 * Tests rendering, click handler, icon changes, and ARIA labels
 */

import React from "react"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { ThemeProvider } from "@/components/theme-provider"
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
  setupMatchMediaMock(false) // Default to light mode
})

describe("ThemeToggle Component - Rendering (T021)", () => {
  it("should render a button element", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
  })

  it("should render Moon icon in light mode", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    // Moon icon should be visible in light mode
    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    // Icon should have aria-label indicating switch to dark mode
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")
  })

  it("should render Sun icon in dark mode", () => {
    localStorageMock.setItem("theme-preference", "dark")

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    // Icon should have aria-label indicating switch to light mode
    expect(button).toHaveAttribute("aria-label", "Zu hellem Modus wechseln")
  })

  it("should have proper ARIA label based on current theme", () => {
    const { rerender } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    // In light mode, button should say "switch to dark"
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")
  })
})

describe("ThemeToggle Component - Click Handler (T022)", () => {
  it("should call toggleTheme when button is clicked", async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")

    // Initial state is light mode
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")

    // Click to toggle to dark
    await user.click(button)

    // Should now be in dark mode
    expect(button).toHaveAttribute("aria-label", "Zu hellem Modus wechseln")
  })

  it("should toggle theme from light to dark to light", async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")

    // Start in light mode
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")

    // Toggle to dark
    await user.click(button)
    expect(button).toHaveAttribute("aria-label", "Zu hellem Modus wechseln")

    // Toggle back to light
    await user.click(button)
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")
  })

  it("should persist theme preference to localStorage on click", async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")

    // Click to toggle to dark
    await user.click(button)

    // Should persist to localStorage
    expect(localStorageMock.getItem("theme-preference")).toBe("dark")
  })
})

describe("ThemeToggle Component - Icon Changes (T023)", () => {
  it("should display Moon icon when theme is light", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")
    // In light mode, show Moon icon (to switch to dark)
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")
  })

  it("should display Sun icon when theme is dark", () => {
    localStorageMock.setItem("theme-preference", "dark")

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")
    // In dark mode, show Sun icon (to switch to light)
    expect(button).toHaveAttribute("aria-label", "Zu hellem Modus wechseln")
  })

  it("should change icon when theme is toggled", async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")

    // Initially light mode - Moon icon
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")

    // Toggle to dark - Sun icon
    await user.click(button)
    expect(button).toHaveAttribute("aria-label", "Zu hellem Modus wechseln")

    // Toggle back to light - Moon icon
    await user.click(button)
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")
  })

  it("should render correct icon after system preference change", async () => {
    const { triggerChange } = setupMatchMediaMock(false) // Start with light

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole("button")

    // Initially light mode
    expect(button).toHaveAttribute("aria-label", "Zu dunklem Modus wechseln")

    // Simulate system preference change to dark
    const { waitFor } = await import("@testing-library/react")
    triggerChange(true)

    // Should now show Sun icon (because system is dark)
    await waitFor(() => {
      expect(button).toHaveAttribute("aria-label", "Zu hellem Modus wechseln")
    })
  })
})
