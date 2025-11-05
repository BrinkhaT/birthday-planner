# Data Model: Theme Switcher

**Feature**: 007-theme-switcher
**Date**: 2025-11-05

## Overview

This document defines the data structures for theme state management. The theme switcher operates entirely in the browser (client-side) with no server-side data storage required.

## Entities

### Theme Preference (Client-Side State)

**Description**: User's explicit theme choice, stored in browser localStorage

**Storage Location**: `localStorage` key `"theme-preference"`

**Schema**:
```typescript
type ThemePreference = "light" | "dark" | "system"
```

**Values**:
- `"light"` - User explicitly selected light mode
- `"dark"` - User explicitly selected dark mode
- `"system"` - User wants to follow OS preference (default)

**Persistence**: Browser localStorage (survives page reloads and browser restarts)

**Validation Rules**:
- Must be one of the three allowed string values
- Invalid values fall back to `"system"`
- Missing key defaults to `"system"`

**Lifecycle**:
- **Created**: When user first toggles theme manually
- **Updated**: When user toggles theme
- **Deleted**: Never (remains until browser storage cleared)

**Example**:
```typescript
// User selected dark mode
localStorage.setItem('theme-preference', 'dark')

// User wants system preference
localStorage.setItem('theme-preference', 'system')
```

---

### Theme State (Runtime State)

**Description**: Current active theme being displayed in the UI

**Storage Location**: React Context (in-memory, not persisted)

**Schema**:
```typescript
type Theme = "light" | "dark"
```

**Values**:
- `"light"` - Light theme currently active
- `"dark"` - Dark theme currently active

**Derivation Logic**:
```typescript
function computeTheme(preference: ThemePreference, systemPreference: Theme): Theme {
  if (preference === "system") {
    return systemPreference  // Use OS preference
  }
  return preference  // Use explicit user choice
}
```

**State Transitions**:
```
Initial State: Computed from localStorage + system preference

User Toggle: light → dark → light (cycles)

System Change (when preference="system"):
  OS changes from light → dark: light → dark
  OS changes from dark → light: dark → light

Manual Override (when preference="light" or "dark"):
  OS changes: No effect (user preference takes precedence)
```

**Lifecycle**:
- **Created**: On initial page load (ThemeProvider mount)
- **Updated**: On user toggle or system preference change
- **Destroyed**: On page unload

---

## React Context Schema

**Context Shape**:
```typescript
interface ThemeContextValue {
  theme: Theme                          // Current active theme
  setTheme: (theme: Theme) => void      // Set theme explicitly
  toggleTheme: () => void               // Toggle between light/dark
  systemPreference: Theme               // Current OS preference
  preference: ThemePreference           // User's stored preference
}
```

**Provider Component**:
```typescript
<ThemeProvider>
  {/* App components */}
</ThemeProvider>
```

**Consumer Hook**:
```typescript
const { theme, toggleTheme } = useTheme()
```

---

## Browser APIs

### localStorage

**Purpose**: Persist user's theme preference across sessions

**Operations**:
```typescript
// Read
const preference = localStorage.getItem('theme-preference') as ThemePreference | null

// Write
localStorage.setItem('theme-preference', 'dark')

// Error Handling (graceful degradation)
try {
  localStorage.setItem('theme-preference', theme)
} catch (e) {
  // Private browsing or storage disabled - continue without persistence
  console.warn('Theme persistence unavailable')
}
```

**Storage Limits**: Not a concern (single small string value)

---

### matchMedia

**Purpose**: Detect and monitor system theme preference

**Operations**:
```typescript
// Initial detection
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const systemPreference: Theme = mediaQuery.matches ? 'dark' : 'light'

// Monitor changes
mediaQuery.addEventListener('change', (e) => {
  const newPreference: Theme = e.matches ? 'dark' : 'light'
  // Update theme if user hasn't overridden
})
```

**Cleanup**: Remove event listener on component unmount

---

## DOM Manipulation

### HTML Class Toggle

**Purpose**: Apply theme to entire page via Tailwind's dark mode

**Operations**:
```typescript
// Apply dark theme
document.documentElement.classList.add('dark')

// Apply light theme
document.documentElement.classList.remove('dark')
```

**Timing**: Must execute before React hydration to prevent FOUC

---

## Data Flow Diagram

```
Page Load
    │
    ↓
Read localStorage['theme-preference']  ──→  Default to "system" if missing
    │
    ↓
Detect system preference via matchMedia
    │
    ↓
Compute theme = (preference === "system") ? systemPreference : preference
    │
    ↓
Apply theme via document.documentElement.classList
    │
    ↓
Initialize ThemeProvider with computed theme
    │
    ↓
Render app with theme state available
    │
    ↓
User clicks ThemeToggle
    │
    ↓
toggleTheme() → theme = (theme === "light") ? "dark" : "light"
    │
    ↓
setTheme(newTheme)
    │
    ├──→ Update localStorage['theme-preference']
    ├──→ Update document.documentElement.classList
    └──→ Update React state (triggers re-render)
```

---

## Migration & Versioning

**Current Version**: 1.0.0 (initial implementation)

**Future Considerations**:
- **Multi-value toggle**: Add `"system"` option to toggle cycle (light → dark → system → light)
- **Scheduled themes**: Time-based theme switching (e.g., dark mode 8pm-6am)
- **Per-component themes**: Different themes for different sections (low priority)

**Backward Compatibility**:
- Missing localStorage key → defaults to "system" ✅
- Invalid localStorage value → falls back to "system" ✅
- No breaking changes expected for future enhancements

---

## Validation Rules

### Theme Preference Validation

```typescript
function validateThemePreference(value: string | null): ThemePreference {
  if (value === "light" || value === "dark" || value === "system") {
    return value
  }
  return "system"  // Default fallback
}
```

### Theme State Validation

```typescript
function validateTheme(value: string): Theme {
  return value === "dark" ? "dark" : "light"  // Default to light
}
```

---

## Testing Considerations

**Mock localStorage**:
```typescript
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) { return this.store[key] || null },
  setItem(key: string, value: string) { this.store[key] = value },
  clear() { this.store = {} }
}
```

**Mock matchMedia**:
```typescript
const mockMatchMedia = (matches: boolean) => ({
  matches,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(),     // Deprecated but may be called
  removeListener: jest.fn(),  // Deprecated but may be called
})
```

**Test Scenarios**:
1. ✅ Initial load with no stored preference → defaults to system
2. ✅ Initial load with stored "dark" → applies dark theme
3. ✅ Toggle from light to dark → updates localStorage and DOM
4. ✅ System preference changes while preference="system" → updates theme
5. ✅ System preference changes while preference="dark" → no change
6. ✅ localStorage unavailable → gracefully continues without persistence

---

## Performance Characteristics

**Storage Operations**:
- localStorage read: < 1ms (synchronous)
- localStorage write: < 1ms (synchronous)
- localStorage size: ~20 bytes (negligible)

**State Updates**:
- React Context update: < 5ms (triggers re-render of consumers only)
- DOM class toggle: < 1ms (direct manipulation)
- CSS variable cascade: < 10ms (browser-optimized)

**Total Theme Switch Time**: < 20ms (well under 50ms requirement)

---

## Security & Privacy

**No Sensitive Data**: Theme preference is not PII (Personally Identifiable Information)

**localStorage Isolation**: Scoped to origin (no cross-site access)

**No Server Transmission**: Theme preference never sent to server

**Privacy Mode Compatibility**: Gracefully degrades when localStorage disabled (in-memory only)

---

## Dependencies

**No external data dependencies**:
- ✅ No API calls
- ✅ No database
- ✅ No cookies
- ✅ No server-side state

**Browser API dependencies**:
- `localStorage` (Web Storage API) - 98% browser support
- `matchMedia` (CSSOM View Module) - 97% browser support
- `classList` (DOM) - 99% browser support
