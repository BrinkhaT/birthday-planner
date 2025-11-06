# Component API Contracts: Theme Switcher

**Feature**: 007-theme-switcher
**Date**: 2025-11-05

## Overview

This document defines the public API contracts for theme-related components and hooks. This is a client-side only feature with no server-side API endpoints.

---

## ThemeProvider Component

**File**: `components/theme-provider.tsx`

**Purpose**: Provides theme state to the entire application via React Context

**Props**:
```typescript
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: "light" | "dark" | "system"  // Optional, defaults to "system"
  storageKey?: string                         // Optional, defaults to "theme-preference"
}
```

**Usage**:
```tsx
// In app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Blocking script for FOUC prevention */}
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme-preference">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Behavior**:
- Reads `storageKey` from localStorage on mount
- Detects system preference via `matchMedia`
- Computes initial theme and applies to `<html>` element
- Listens for system preference changes
- Provides theme context to all children

**Side Effects**:
- Adds/removes `dark` class on `document.documentElement`
- Writes to localStorage on theme changes
- Registers `matchMedia` event listener

**Cleanup**:
- Removes `matchMedia` event listener on unmount

---

## useTheme Hook

**File**: `lib/hooks/use-theme.ts`

**Purpose**: Custom hook for consuming theme state and actions

**Return Type**:
```typescript
interface UseThemeReturn {
  theme: "light" | "dark"                    // Current active theme
  setTheme: (theme: "light" | "dark" | "system") => void  // Set theme explicitly
  toggleTheme: () => void                    // Toggle between light/dark
  systemPreference: "light" | "dark"         // Current OS preference
  preference: "light" | "dark" | "system"    // User's stored preference
}
```

**Usage**:
```typescript
import { useTheme } from "@/lib/hooks/use-theme"

function MyComponent() {
  const { theme, toggleTheme, preference } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>User preference: {preference}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}
```

**Behavior**:
- Must be used within `<ThemeProvider>` (throws error otherwise)
- `theme` reflects computed active theme (light or dark)
- `setTheme("system")` reverts to system preference
- `toggleTheme()` cycles: light → dark → light (ignores "system")
- Updates are synchronous (no async operations)

**Error Handling**:
```typescript
// Throws if used outside ThemeProvider
if (!context) {
  throw new Error('useTheme must be used within ThemeProvider')
}
```

---

## ThemeToggle Component

**File**: `components/theme-toggle.tsx`

**Purpose**: Button component for toggling between light and dark themes

**Props**:
```typescript
interface ThemeToggleProps {
  className?: string           // Optional Tailwind classes
  variant?: "ghost" | "outline" | "default"  // ShadCN Button variant
  size?: "sm" | "default" | "lg" | "icon"    // ShadCN Button size
}
```

**Usage**:
```tsx
import { ThemeToggle } from "@/components/theme-toggle"

// Default usage (icon button)
<ThemeToggle />

// Custom styling
<ThemeToggle variant="outline" size="sm" className="ml-4" />
```

**Behavior**:
- Renders ShadCN Button with sun/moon icon
- Icon changes based on current theme:
  - Light mode: Shows Moon icon (click to enable dark mode)
  - Dark mode: Shows Sun icon (click to enable light mode)
- Click handler calls `toggleTheme()` from `useTheme` hook
- ARIA label changes based on theme (German localized)

**Accessibility**:
```typescript
// ARIA labels (from i18n-de.ts)
ariaLabel={theme === 'dark'
  ? 'Zu hellem Modus wechseln'     // "Switch to light mode"
  : 'Zu dunklem Modus wechseln'    // "Switch to dark mode"
}
```

**Visual States**:
- Default: Ghost button with icon
- Hover: ShadCN hover state
- Focus: Keyboard focus ring (accessibility)
- Active: ShadCN active state

**Mobile Considerations**:
- Minimum tap target: 44x44px (iOS/Android standards)
- Touch-friendly spacing

---

## German Localization Strings

**File**: `lib/i18n-de.ts` (additions)

**Purpose**: German labels for theme-related UI

**Schema**:
```typescript
export const i18nTheme = {
  toggleLight: 'Zu hellem Modus wechseln',   // "Switch to light mode"
  toggleDark: 'Zu dunklem Modus wechseln',   // "Switch to dark mode"
  themeLabel: 'Theme',                       // "Theme"
  lightMode: 'Heller Modus',                 // "Light mode"
  darkMode: 'Dunkler Modus',                 // "Dark mode"
  systemMode: 'System',                      // "System"
}
```

**Usage**:
```typescript
import { i18nTheme } from "@/lib/i18n-de"

<Button aria-label={theme === 'dark' ? i18nTheme.toggleLight : i18nTheme.toggleDark}>
  {/* Icon */}
</Button>
```

---

## Component Integration Examples

### Example 1: Adding Theme Toggle to Header

```tsx
// app/layout.tsx or components/header.tsx
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <h1>Geburtstagplaner</h1>
        <ThemeToggle />
      </div>
    </header>
  )
}
```

### Example 2: Conditional Styling Based on Theme

```tsx
import { useTheme } from "@/lib/hooks/use-theme"

export function CustomComponent() {
  const { theme } = useTheme()

  return (
    <div className={theme === 'dark' ? 'custom-dark-class' : 'custom-light-class'}>
      {/* Content */}
    </div>
  )
}
```

### Example 3: Respecting User Preference

```tsx
import { useTheme } from "@/lib/hooks/use-theme"

export function AdaptiveComponent() {
  const { preference, setTheme } = useTheme()

  // Show different UI based on whether user has explicitly set preference
  if (preference === 'system') {
    return <p>Folgt Systemeinstellung</p>  // "Following system setting"
  }

  return (
    <div>
      <p>Manuelle Auswahl: {preference}</p>
      <button onClick={() => setTheme('system')}>
        Auf System zurücksetzen
      </button>
    </div>
  )
}
```

---

## State Machine Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      ThemeProvider                          │
│                                                             │
│  State: { theme, preference, systemPreference }             │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Initial Load                                      │    │
│  │  1. Read localStorage['theme-preference']         │    │
│  │  2. Detect systemPreference via matchMedia        │    │
│  │  3. Compute theme                                 │    │
│  │  4. Apply to DOM                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  User Actions                                      │    │
│  │  • toggleTheme(): light ↔ dark                    │    │
│  │  • setTheme('light'|'dark'|'system')              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  System Events                                     │    │
│  │  • matchMedia change → update systemPreference    │    │
│  │  • If preference='system' → update theme          │    │
│  │  • If preference!='system' → ignore               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
                    ┌─────────────────────┐
                    │   useTheme Hook     │
                    │  (Consumer Access)  │
                    └─────────────────────┘
                              │
                              ↓
                    ┌─────────────────────┐
                    │   ThemeToggle       │
                    │   (UI Component)    │
                    └─────────────────────┘
```

---

## Error Scenarios & Handling

### Scenario 1: localStorage Unavailable

**Cause**: Private browsing mode, storage quota exceeded, browser restrictions

**Handling**:
```typescript
try {
  localStorage.setItem('theme-preference', theme)
} catch (error) {
  console.warn('Theme persistence unavailable:', error)
  // Continue without persistence (in-memory only)
}
```

**User Impact**: Theme preference not saved across sessions

---

### Scenario 2: matchMedia Unsupported

**Cause**: Very old browsers (pre-2012)

**Handling**:
```typescript
const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
const systemPreference = mediaQuery?.matches ? 'dark' : 'light'
```

**User Impact**: Defaults to light theme, manual toggle still works

---

### Scenario 3: Invalid localStorage Value

**Cause**: Manual tampering, migration from old version

**Handling**:
```typescript
function validateThemePreference(value: string | null): ThemePreference {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value
  }
  return 'system'  // Safe fallback
}
```

**User Impact**: Falls back to system preference (safe default)

---

### Scenario 4: useTheme Outside Provider

**Cause**: Developer error (hook used outside ThemeProvider)

**Handling**:
```typescript
if (!context) {
  throw new Error('useTheme must be used within ThemeProvider')
}
```

**User Impact**: Development-time error (caught during testing)

---

## Performance Contracts

**ThemeProvider Mount**:
- Initial render: < 50ms
- localStorage read: < 1ms
- matchMedia setup: < 5ms
- DOM class application: < 1ms

**Theme Toggle**:
- onClick handler: < 5ms
- State update: < 10ms
- localStorage write: < 1ms
- DOM class toggle: < 1ms
- Re-render consumers: < 20ms
- **Total**: < 50ms (meets SC-002 requirement)

**System Preference Change**:
- Event trigger: < 1ms
- Conditional update: < 5ms (only if preference='system')
- DOM update: < 1ms
- Re-render: < 10ms

---

## Testing Contracts

**Unit Tests Required**:
- ✅ ThemeProvider initializes with correct default
- ✅ useTheme throws error outside provider
- ✅ toggleTheme cycles light → dark → light
- ✅ setTheme updates preference correctly
- ✅ System preference changes update theme when preference='system'
- ✅ System preference changes ignored when preference≠'system'
- ✅ localStorage read/write operations
- ✅ Graceful handling of localStorage errors

**Integration Tests Required**:
- ✅ Full theme switch flow (user click → state update → DOM update)
- ✅ Theme persists across simulated page reload
- ✅ Multiple components consuming useTheme update together

**Coverage Target**: 80%+ (per Constitution Principle VII)

---

## Versioning

**Current Version**: 1.0.0

**Breaking Changes Policy**:
- Major version bump if:
  - ThemeProvider props change (remove/rename)
  - useTheme return type changes
  - localStorage key format changes (requires migration)
- Minor version bump if:
  - New optional props added
  - New utility functions exported
- Patch version bump if:
  - Bug fixes
  - Performance improvements
  - Documentation updates

---

## Dependencies

**React Dependencies**:
- `react` (v19) - Context API, hooks
- `next` (v16) - App Router, Server Components

**UI Dependencies**:
- `@/components/ui/button` (ShadCN) - ThemeToggle base
- `lucide-react` - Sun/Moon icons

**Browser APIs**:
- `localStorage` (Web Storage API)
- `window.matchMedia` (CSSOM View Module)
- `document.documentElement.classList` (DOM)

**No External Libraries**: All dependencies already present in project ✅
