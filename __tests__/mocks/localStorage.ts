/**
 * Mock implementation of localStorage for testing
 * Provides in-memory storage that can be cleared between tests
 */

export function createLocalStorageMock() {
  let store: Record<string, string> = {}

  return {
    getItem(key: string): string | null {
      return store[key] || null
    },
    setItem(key: string, value: string): void {
      store[key] = value
    },
    removeItem(key: string): void {
      delete store[key]
    },
    clear(): void {
      store = {}
    },
    get length(): number {
      return Object.keys(store).length
    },
    key(index: number): string | null {
      const keys = Object.keys(store)
      return keys[index] || null
    },
  }
}

export const localStorageMock = createLocalStorageMock()
