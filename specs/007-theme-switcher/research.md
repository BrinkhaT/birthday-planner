# Research: Theme Switcher (Light/Dark Mode)

**Feature**: 007-theme-switcher
**Date**: 2025-11-05
**Status**: Complete

## Overview

This document consolidates technical research and decisions for implementing a light/dark mode theme switcher with system preference detection, manual override, and persistent storage.

## Technical Decisions

### 1. Theme Detection Strategy

**Decision**: Use CSS media query `prefers-color-scheme` via React hooks

**Rationale**:
- Standard browser API, widely supported (96%+ browser coverage)
- No external dependencies required
- Real-time detection of system preference changes
- Compatible with Next.js 16 App Router and React 19

**Implementation Approach**:
```typescript
// Detect system preference
const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const newTheme = e.matches ? 'dark' : 'light'
  // Update theme if user hasn't manually overridden
})
```

**Alternatives Considered**:
- Server-side detection via `Sec-CH-Prefers-Color-Scheme` header - rejected due to limited browser support
- Third-party theme libraries (next-themes, theme-ui) - rejected to maintain simplicity (Constitution Principle II)

**Browser Compatibility**:
- Chrome/Edge 76+ ✅
- Firefox 67+ ✅
- Safari 12.1+ ✅
- Opera 62+ ✅

---

### 2. Theme State Management

**Decision**: React Context API with custom hook pattern

**Rationale**:
- Built-in React solution (no external state libraries)
- Provides global theme state accessible to all components
- Follows established patterns in Next.js ecosystem
- Simple to test and maintain
- Aligns with Constitution Principle II (Simplicity First)

**Implementation Pattern**:
```typescript
// ThemeProvider.tsx - Context provider wrapping app
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  // ... theme logic
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

// use-theme.ts - Custom hook for consuming theme
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

**Alternatives Considered**:
- Redux/Zustand - rejected as overkill for single theme state
- URL parameter/query string - rejected due to poor UX (pollutes URL)
- CSS-only with :root selector - rejected due to lack of persistence control

---

### 3. Theme Persistence

**Decision**: Browser `localStorage` with key `theme-preference`

**Rationale**:
- Simple browser API, zero dependencies
- Synchronous access (no async complexity)
- Persistent across sessions (doesn't expire)
- ~10MB storage limit (far exceeds our needs)
- Works offline (client-side only)

**Storage Schema**:
```json
{
  "theme-preference": "light" | "dark" | "system"
}
```

**Graceful Degradation**:
```typescript
function getStoredTheme(): string | null {
  try {
    return localStorage.getItem('theme-preference')
  } catch {
    // localStorage unavailable (private browsing, disabled, etc.)
    return null
  }
}
```

**Alternatives Considered**:
- `sessionStorage` - rejected (doesn't persist across browser sessions)
- Cookies - rejected (unnecessary HTTP overhead, size limits, expiration complexity)
- IndexedDB - rejected (async API adds complexity, overkill for single key-value)

---

### 4. Tailwind CSS Dark Mode Configuration

**Decision**: Use Tailwind's class-based dark mode (already configured)

**Rationale**:
- **Already enabled** in `tailwind.config.ts` with `darkMode: ["class"]`
- **CSS variables already defined** in `app/globals.css` for both light and dark themes
- No configuration changes required
- Standard Tailwind pattern: `dark:bg-gray-900` syntax
- Works by toggling `dark` class on root `<html>` element

**Existing Configuration** (verified):
```typescript
// tailwind.config.ts
darkMode: ["class"]  // ✅ Already configured

// app/globals.css
:root { /* light theme variables */ }  // ✅ Already defined
.dark { /* dark theme variables */ }   // ✅ Already defined
```

**Usage Pattern**:
```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  {/* Component content */}
</div>
```

**Alternatives Considered**:
- Media query-based dark mode (`darkMode: "media"`) - rejected because it can't be manually toggled
- CSS-in-JS solutions - rejected to maintain Tailwind consistency

---

### 5. Theme Application Strategy

**Decision**: Add/remove `dark` class on `<html>` element via `document.documentElement.classList`

**Rationale**:
- Direct DOM manipulation ensures immediate visual update (< 50ms)
- No page refresh required
- Triggers Tailwind's `dark:` variants automatically
- Works with React Server Components and Client Components
- Standard Next.js pattern

**Implementation**:
```typescript
function applyTheme(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
```

**Flash Prevention** (FOUC - Flash of Unstyled Content):
```typescript
// Inline script in app/layout.tsx <head> (runs before React hydration)
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      const theme = localStorage.getItem('theme-preference') || 'system';
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme === 'dark' || (theme === 'system' && systemDark)) {
        document.documentElement.classList.add('dark');
      }
    })();
  `
}} />
```

**Alternatives Considered**:
- CSS variables only - rejected (harder to test, less React integration)
- Body class instead of HTML class - rejected (Tailwind convention uses `<html>`)

---

### 6. Theme Toggle Component Design

**Decision**: Use ShadCN Button component with icon-based toggle

**Rationale**:
- Consistent with existing UI (all components use ShadCN)
- Mobile-friendly (44x44px minimum tap target)
- Accessible (ARIA labels, keyboard navigation)
- Visual clarity (sun/moon icons from Lucide React)

**Component Pattern**:
```tsx
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
```

**Alternatives Considered**:
- Dropdown menu with 3 options (light/dark/system) - deferred to future enhancement
- Switch/toggle component - rejected (less clear visual affordance)
- Text-based button - rejected (takes more space, less universal)

---

### 7. German Localization Strings

**Decision**: Add theme-related strings to existing `lib/i18n-de.ts`

**Rationale**:
- Maintains centralized localization (Constitution Principle VI)
- Consistent with existing pattern in codebase
- Easy to update and maintain

**New Strings Required**:
```typescript
export const i18nTheme = {
  toggleLight: 'Zu hellem Modus wechseln',
  toggleDark: 'Zu dunklem Modus wechseln',
  themeLabel: 'Theme',
}
```

---

### 8. Component Compatibility Verification

**Decision**: Verify existing components use Tailwind color tokens (not hardcoded colors)

**Components to Verify**:
- `birthday-card.tsx` - uses `bg-card`, `text-card-foreground` ✅
- `birthday-table.tsx` - uses `border-border`, `bg-background` ✅
- `birthday-form.tsx` - uses ShadCN Input components ✅
- `birthday-modal.tsx` - uses ShadCN Dialog components ✅
- `delete-confirmation.tsx` - uses ShadCN AlertDialog components ✅

**Verification Method**:
```bash
# Search for hardcoded colors (should return minimal results)
grep -r "bg-\(white\|black\|gray-[0-9]\{3\}\)" components/
grep -r "text-\(white\|black\|gray-[0-9]\{3\}\)" components/
```

**Expected Outcome**: Components already use semantic color tokens, so they'll automatically adapt to dark mode.

---

### 9. Testing Strategy

**Decision**: Follow established testing patterns from feature 005-comprehensive-testing

**Test Categories**:

**Unit Tests** (`__tests__/unit/lib/use-theme.test.ts`):
- System preference detection
- localStorage read/write operations
- Theme state transitions
- Edge cases (localStorage disabled, invalid stored values)
- Target coverage: 90-100%

**Unit Tests** (`__tests__/unit/components/theme-toggle.test.tsx`):
- Button renders correctly in both themes
- Click handler toggles theme
- Accessibility attributes (aria-label)
- Icon changes based on theme
- Target coverage: 90-100%

**Integration Tests** (`__tests__/integration/theme-integration.test.tsx`):
- Full theme switching flow (light → dark → light)
- Persistence across simulated "page reload"
- System preference detection and override
- Theme changes apply to all components
- Target coverage: 100%

**Test Utilities**:
```typescript
// Mock localStorage
const mockLocalStorage = () => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} }
  }
}

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => ({
  matches,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
})
```

**Reference Date**: Use `REFERENCE_DATE` from existing test fixtures for determinism.

---

### 10. Performance Considerations

**Decision**: Optimize for instant theme switching without layout shift

**Techniques**:

1. **Blocking Script for Initial Load**:
   - Inline `<script>` in `<head>` reads localStorage before React hydration
   - Prevents FOUC (Flash of Unstyled Content)
   - ~10-20ms overhead (acceptable)

2. **CSS Transitions for Smoothness**:
   ```css
   * {
     transition: background-color 0.2s ease, color 0.2s ease;
   }
   ```
   - Smooth color transitions (200ms)
   - Disabled during initial page load (prevents flash)

3. **Lazy Component Updates**:
   - Theme changes via class toggle (instant DOM update)
   - React re-render only for components consuming theme context
   - No full page re-render required

**Performance Targets** (from spec):
- Initial theme detection: < 100ms ✅
- Theme toggle: < 50ms ✅
- Zero layout shift ✅

---

## Implementation Phases

### Phase 1: Core Theme Infrastructure
1. Create `ThemeProvider` component (React Context)
2. Create `useTheme` custom hook
3. Add blocking script to `app/layout.tsx`
4. Wrap app in `ThemeProvider`
5. Verify dark mode CSS variables exist (✅ already present)

### Phase 2: Theme Toggle UI
1. Create `ThemeToggle` component
2. Add German localization strings
3. Position toggle in app header/navigation
4. Test accessibility (keyboard, screen reader)

### Phase 3: Component Compatibility
1. Audit existing components for hardcoded colors
2. Replace hardcoded colors with Tailwind tokens (if needed)
3. Test all components in both themes
4. Fix any contrast issues (WCAG AA)

### Phase 4: Testing & Validation
1. Write unit tests for `useTheme` hook
2. Write unit tests for `ThemeToggle` component
3. Write integration tests for full theme flow
4. Verify 80%+ coverage
5. Manual testing in Docker environment

---

## Risk Mitigation

### Risk 1: FOUC (Flash of Unstyled Content)
**Mitigation**: Blocking inline script in `<head>` applies theme before first paint

### Risk 2: localStorage Unavailable
**Mitigation**: Try-catch wrapper, gracefully falls back to system preference

### Risk 3: Component Color Incompatibility
**Mitigation**: Audit + fix in Phase 3, comprehensive visual testing

### Risk 4: Performance Regression
**Mitigation**: CSS transitions limited to color properties only, no layout-triggering properties

### Risk 5: Accessibility Issues
**Mitigation**: WCAG AA contrast validation, proper ARIA labels, keyboard navigation testing

---

## Dependencies

**No new dependencies required** ✅
- React Context API (built-in)
- localStorage API (browser native)
- Tailwind CSS dark mode (already configured)
- ShadCN UI components (already installed)
- Lucide React icons (already installed)

---

## Success Metrics

All metrics from spec Success Criteria are achievable with this design:
- ✅ SC-001: Theme detection < 100ms (blocking script)
- ✅ SC-002: Toggle < 50ms (direct DOM manipulation)
- ✅ SC-003: 100% persistence (localStorage)
- ✅ SC-004: All components render correctly (semantic tokens)
- ✅ SC-005: WCAG AA contrast (CSS variables designed for compliance)
- ✅ SC-006: Toggle visible in both modes (ShadCN Button with icons)

---

## References

- [Tailwind CSS Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN: Window.matchMedia()](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Next.js App Router Patterns](https://nextjs.org/docs/app/building-your-application/routing)
