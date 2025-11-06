/**
 * Mock implementation of window.matchMedia for testing
 * Allows simulating different system theme preferences
 */

type MediaQueryListener = (event: MediaQueryListEvent) => void

export function createMatchMediaMock(matches: boolean = false) {
  const listeners: MediaQueryListener[] = []

  const mockMediaQueryList: MediaQueryList = {
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addListener: jest.fn((callback: MediaQueryListener) => {
      listeners.push(callback)
    }),
    removeListener: jest.fn((callback: MediaQueryListener) => {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }),
    addEventListener: jest.fn((event: string, callback: MediaQueryListener) => {
      if (event === "change") {
        listeners.push(callback)
      }
    }),
    removeEventListener: jest.fn((event: string, callback: MediaQueryListener) => {
      if (event === "change") {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }),
    dispatchEvent: jest.fn(),
  }

  // Helper to trigger change events
  const triggerChange = (newMatches: boolean) => {
    mockMediaQueryList.matches = newMatches
    const event = {
      matches: newMatches,
      media: mockMediaQueryList.media,
    } as MediaQueryListEvent

    listeners.forEach((listener) => listener(event))
  }

  return {
    mockMediaQueryList,
    triggerChange,
    listeners,
  }
}

export function setupMatchMediaMock(matches: boolean = false) {
  const mock = createMatchMediaMock(matches)

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn(() => mock.mockMediaQueryList),
  })

  return mock
}
