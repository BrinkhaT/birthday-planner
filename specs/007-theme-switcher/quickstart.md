# Quickstart Guide: Theme Switcher

**Feature**: 007-theme-switcher
**Date**: 2025-11-05

## Overview

This guide provides step-by-step instructions for implementing and validating the light/dark mode theme switcher feature.

---

## Prerequisites

✅ **Verify Before Starting**:

1. **Tailwind Dark Mode Configured**:
   ```bash
   # Check tailwind.config.ts has darkMode: ["class"]
   grep -A 1 "darkMode" tailwind.config.ts
   # Expected output: darkMode: ["class"]
   ```

2. **Dark Mode CSS Variables Exist**:
   ```bash
   # Check app/globals.css has .dark selector
   grep -A 10 "\.dark {" app/globals.css
   # Expected: CSS variables for dark theme colors
   ```

3. **ShadCN Components Installed**:
   ```bash
   # Check components/ui directory exists
   ls components/ui/
   # Expected: button.tsx and other ShadCN components
   ```

4. **Lucide React Icons Available**:
   ```bash
   # Check package.json for lucide-react
   grep "lucide-react" package.json
   # Expected: "lucide-react": "^x.x.x"
   ```

**Result**: All prerequisites already met ✅ (verified in research phase)

---

## Implementation Sequence

### Phase 1: Core Theme Infrastructure (1-2 hours)

#### Step 1.1: Create useTheme Hook

**File**: `lib/hooks/use-theme.ts`

**Command**:
```bash
# Create hooks directory if it doesn't exist
mkdir -p lib/hooks

# Create the file (implement based on contracts/component-api.md)
touch lib/hooks/use-theme.ts
```

**Implementation Checklist**:
- [ ] Define `ThemeContextValue` interface
- [ ] Create `ThemeContext` with `createContext`
- [ ] Detect system preference via `matchMedia`
- [ ] Read/write localStorage with error handling
- [ ] Implement `toggleTheme()` function
- [ ] Export `useTheme()` hook

**Validation**:
```typescript
// Quick test in a component
const { theme, toggleTheme } = useTheme()
console.log('Current theme:', theme)  // Should log "light" or "dark"
```

---

#### Step 1.2: Create ThemeProvider Component

**File**: `components/theme-provider.tsx`

**Command**:
```bash
touch components/theme-provider.tsx
```

**Implementation Checklist**:
- [ ] Import `useTheme` logic (or inline in provider)
- [ ] Accept `defaultTheme` and `storageKey` props
- [ ] Initialize state with computed theme
- [ ] Apply theme to `document.documentElement.classList`
- [ ] Listen for `matchMedia` changes
- [ ] Cleanup event listeners on unmount

**Validation**:
```tsx
// Wrap a test component
<ThemeProvider>
  <TestComponent />
</ThemeProvider>

// TestComponent should be able to call useTheme()
```

---

#### Step 1.3: Add Blocking Script to Prevent FOUC

**File**: `app/layout.tsx`

**Location**: Inside `<head>` tag, before any stylesheets

**Code**:
```tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          try {
            const theme = localStorage.getItem('theme-preference') || 'system';
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (theme === 'dark' || (theme === 'system' && systemDark)) {
              document.documentElement.classList.add('dark');
            }
          } catch (e) {
            console.warn('Theme initialization failed:', e);
          }
        })();
      `,
    }}
  />
  {/* Rest of head content */}
</head>
```

**Validation**:
1. Set localStorage manually: `localStorage.setItem('theme-preference', 'dark')`
2. Reload page
3. Verify no flash of light theme before dark theme applies

---

#### Step 1.4: Wrap App in ThemeProvider

**File**: `app/layout.tsx`

**Modification**:
```tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>{/* Blocking script from Step 1.3 */}</head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme-preference">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Note**: `suppressHydrationWarning` needed because blocking script adds `dark` class before React hydration

**Validation**:
```bash
npm run dev
# Open browser DevTools → Console
# No errors about Context being undefined
```

---

### Phase 2: Theme Toggle UI (1 hour)

#### Step 2.1: Add German Localization Strings

**File**: `lib/i18n-de.ts`

**Addition**:
```typescript
// Add to existing i18n object
export const i18nTheme = {
  toggleLight: 'Zu hellem Modus wechseln',
  toggleDark: 'Zu dunklem Modus wechseln',
  themeLabel: 'Theme',
  lightMode: 'Heller Modus',
  darkMode: 'Dunkler Modus',
  systemMode: 'System',
}
```

---

#### Step 2.2: Create ThemeToggle Component

**File**: `components/theme-toggle.tsx`

**Command**:
```bash
touch components/theme-toggle.tsx
```

**Implementation Checklist**:
- [ ] Import `useTheme` hook
- [ ] Import `Button` from `@/components/ui/button`
- [ ] Import `Moon`, `Sun` from `lucide-react`
- [ ] Import `i18nTheme` from `@/lib/i18n-de`
- [ ] Render button with sun/moon icon based on theme
- [ ] Add ARIA label from i18nTheme
- [ ] onClick calls `toggleTheme()`

**Validation**:
```tsx
// Test in page.tsx temporarily
import { ThemeToggle } from "@/components/theme-toggle"

<div className="p-4">
  <ThemeToggle />
</div>

// Click button → theme should change
// Icon should switch from moon to sun (or vice versa)
```

---

#### Step 2.3: Add ThemeToggle to Layout

**File**: `app/layout.tsx` or create `components/header.tsx`

**Placement Options**:

**Option A: Add to existing page header**
```tsx
// In app/page.tsx (temporary placement)
<div className="container mx-auto p-4">
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold">Geburtstagplaner</h1>
    <ThemeToggle />
  </div>
  {/* Rest of page content */}
</div>
```

**Option B: Create dedicated header component**
```tsx
// components/header.tsx
export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <h1 className="text-2xl font-semibold">Geburtstagplaner</h1>
        <ThemeToggle />
      </div>
    </header>
  )
}
```

**Validation**:
1. Theme toggle visible on all pages
2. Click toggle → entire page changes theme
3. Refresh page → theme persists

---

### Phase 3: Component Compatibility (2-3 hours)

#### Step 3.1: Audit Existing Components

**Command**:
```bash
# Search for hardcoded color classes
grep -r "bg-white\|bg-black\|bg-gray-[0-9]" components/ --include="*.tsx"
grep -r "text-white\|text-black\|text-gray-[0-9]" components/ --include="*.tsx"
```

**Expected**: Minimal results (components should use semantic tokens)

**Components to Verify**:
- [ ] `components/birthday-card.tsx`
- [ ] `components/birthday-table.tsx`
- [ ] `components/birthday-form.tsx`
- [ ] `components/birthday-modal.tsx`
- [ ] `components/delete-confirmation.tsx`

---

#### Step 3.2: Manual Visual Testing

**Test Procedure**:
1. Start dev server: `npm run dev`
2. Open application in browser
3. Load page with all components visible
4. Toggle theme with ThemeToggle button
5. Verify each component:
   - [ ] Birthday cards render correctly in dark mode
   - [ ] Birthday table readable in dark mode
   - [ ] Form inputs visible and usable in dark mode
   - [ ] Modal dialogs styled correctly in dark mode
   - [ ] Delete confirmation dialog readable in dark mode
   - [ ] No invisible text (check contrast)
   - [ ] No layout shifts on theme change

**Tools**:
- Browser DevTools → Inspect element → Computed styles
- Lighthouse → Accessibility → Contrast ratios

---

#### Step 3.3: Fix Color Issues (If Any)

**Common Fixes**:

**Issue**: Hardcoded white background
```tsx
// Before
<div className="bg-white">

// After
<div className="bg-card">  // Uses CSS variable
```

**Issue**: Hardcoded black text
```tsx
// Before
<p className="text-black">

// After
<p className="text-foreground">  // Uses CSS variable
```

**Issue**: Hardcoded gray border
```tsx
// Before
<div className="border-gray-200">

// After
<div className="border-border">  // Uses CSS variable
```

**Reference**: Tailwind CSS variables defined in `app/globals.css`

---

### Phase 4: Testing & Validation (2-3 hours)

#### Step 4.1: Write Unit Tests for useTheme Hook

**File**: `__tests__/unit/lib/use-theme.test.ts`

**Command**:
```bash
mkdir -p __tests__/unit/lib
touch __tests__/unit/lib/use-theme.test.ts
```

**Test Cases**:
- [ ] Hook initializes with system preference
- [ ] Hook throws error outside provider
- [ ] `toggleTheme()` switches light ↔ dark
- [ ] `setTheme('dark')` applies dark theme
- [ ] `setTheme('system')` follows OS preference
- [ ] localStorage read on mount
- [ ] localStorage write on theme change
- [ ] Graceful handling of localStorage errors
- [ ] matchMedia event listener triggers update

**Run Tests**:
```bash
npm test -- use-theme.test.ts
```

---

#### Step 4.2: Write Unit Tests for ThemeToggle Component

**File**: `__tests__/unit/components/theme-toggle.test.tsx`

**Command**:
```bash
mkdir -p __tests__/unit/components
touch __tests__/unit/components/theme-toggle.test.tsx
```

**Test Cases**:
- [ ] Component renders without errors
- [ ] Shows Moon icon in light mode
- [ ] Shows Sun icon in dark mode
- [ ] Click calls toggleTheme()
- [ ] ARIA label changes based on theme
- [ ] ARIA label uses German text

**Run Tests**:
```bash
npm test -- theme-toggle.test.tsx
```

---

#### Step 4.3: Write Integration Tests

**File**: `__tests__/integration/theme-integration.test.tsx`

**Command**:
```bash
mkdir -p __tests__/integration
touch __tests__/integration/theme-integration.test.tsx
```

**Test Cases**:
- [ ] Full theme switch flow (light → dark → light)
- [ ] Theme persists across simulated reload
- [ ] Multiple components consuming useTheme update together
- [ ] System preference change updates theme
- [ ] Manual override prevents system updates

**Run Tests**:
```bash
npm test -- theme-integration.test.tsx
```

---

#### Step 4.4: Verify Coverage

**Command**:
```bash
npm test -- --coverage --collectCoverageFrom='components/theme-*.tsx' --collectCoverageFrom='lib/hooks/use-theme.ts'
```

**Target**: 80%+ coverage (per Constitution Principle VII)

**Coverage Report Location**: `coverage/lcov-report/index.html`

---

#### Step 4.5: Run Full Test Suite

**Command**:
```bash
npm test
```

**Expected**: All tests pass ✅

---

### Phase 5: Docker Validation (30 minutes)

#### Step 5.1: Build Docker Image

**Command**:
```bash
docker-compose build
```

**Expected**: Build succeeds without errors

---

#### Step 5.2: Run Docker Container

**Command**:
```bash
docker-compose up -d
```

**Access**: http://localhost:3000

---

#### Step 5.3: Validate in Docker Environment

**Test Checklist**:
- [ ] App loads successfully
- [ ] Theme toggle visible and functional
- [ ] Theme switches correctly
- [ ] Theme persists across page refresh
- [ ] No console errors in browser DevTools

---

#### Step 5.4: Stop Container

**Command**:
```bash
docker-compose down
```

---

## Validation Checklist

### Functional Requirements (from spec.md)

- [ ] **FR-001**: System detects OS theme preference on page load
- [ ] **FR-002**: Defaults to light theme when preference unavailable
- [ ] **FR-003**: Manual toggle switches themes
- [ ] **FR-004**: Theme changes apply immediately (no page refresh)
- [ ] **FR-005**: Theme preference persists across sessions
- [ ] **FR-006**: Manual selection overrides system preference
- [ ] **FR-007**: Toggle visible in both light and dark modes
- [ ] **FR-008**: All existing components adapt to both themes
- [ ] **FR-009**: WCAG AA contrast ratios maintained
- [ ] **FR-010**: Consistent theme styling across all pages

### Success Criteria (from spec.md)

- [ ] **SC-001**: Theme displays within 100ms of page load
- [ ] **SC-002**: Toggle switches theme within 50ms
- [ ] **SC-003**: Preference persists 100% when storage available
- [ ] **SC-004**: All components render correctly in both modes
- [ ] **SC-005**: Text contrast meets WCAG AA (4.5:1)
- [ ] **SC-006**: Toggle visible and usable in both modes

### User Stories (from spec.md)

- [ ] **P1 - System Detection**: App matches OS preference on first visit
- [ ] **P2 - Manual Toggle**: User can override system preference
- [ ] **P3 - Persistence**: Choice remembered across sessions

---

## Troubleshooting

### Issue: Flash of Wrong Theme (FOUC)

**Symptom**: Brief light theme flash before dark theme applies

**Cause**: Blocking script not executing before first paint

**Fix**: Verify blocking script is in `<head>` before all other scripts/styles

---

### Issue: Theme Doesn't Persist

**Symptom**: Theme resets to light on page refresh

**Cause**: localStorage not being written or read

**Debug**:
```javascript
// In browser console
console.log(localStorage.getItem('theme-preference'))
// Should log: "light", "dark", or "system"
```

**Fix**: Check localStorage write operation has no errors (check try-catch blocks)

---

### Issue: Components Don't Adapt to Dark Mode

**Symptom**: Components remain light-styled in dark mode

**Cause**: Hardcoded color classes instead of CSS variables

**Debug**:
```bash
# Find hardcoded colors
grep "bg-white\|text-black" components/[component-name].tsx
```

**Fix**: Replace hardcoded colors with semantic tokens (see Phase 3.3)

---

### Issue: Toggle Button Not Visible in Dark Mode

**Symptom**: Can't see toggle button on dark background

**Cause**: Icon color not adapting to theme

**Fix**: Ensure button uses `text-foreground` or ShadCN Button variant handles this

---

### Issue: Tests Failing

**Symptom**: TypeError: localStorage is not defined

**Cause**: Jest environment doesn't include localStorage

**Fix**: Add to jest.setup.js:
```javascript
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
})
```

---

## Performance Benchmarks

**Measurement Tools**:
- Chrome DevTools → Performance tab
- React DevTools → Profiler

**Benchmarks to Verify**:
1. **Initial Theme Detection**: < 100ms
   - Measure: Time from navigation start to theme applied
   - Tool: Performance tab → User Timing marks

2. **Theme Toggle**: < 50ms
   - Measure: Time from click to DOM update
   - Tool: Console.time/timeEnd around toggleTheme()

3. **Re-render Time**: < 20ms
   - Measure: React component re-render time
   - Tool: React DevTools Profiler

**Example Measurement**:
```typescript
// In ThemeToggle component
const handleToggle = () => {
  console.time('theme-toggle')
  toggleTheme()
  console.timeEnd('theme-toggle')
}
// Expected output: theme-toggle: ~5-15ms
```

---

## Accessibility Validation

### WCAG AA Contrast Check

**Tool**: Chrome DevTools → Lighthouse → Accessibility

**Process**:
1. Run Lighthouse audit on light theme
2. Run Lighthouse audit on dark theme
3. Verify no contrast issues reported

**Manual Check**:
1. Install browser extension: WAVE or axe DevTools
2. Scan page in light mode
3. Scan page in dark mode
4. Fix any contrast warnings

---

### Keyboard Navigation

**Test Procedure**:
1. Tab to ThemeToggle button
2. Verify focus ring visible
3. Press Enter/Space to toggle theme
4. Verify theme changes
5. Verify focus remains on button

---

### Screen Reader Testing

**Tools**: VoiceOver (macOS), NVDA (Windows)

**Test**:
1. Enable screen reader
2. Navigate to ThemeToggle button
3. Verify ARIA label announced in German
4. Activate button
5. Verify label changes after toggle

**Expected Announcement**: "Zu dunklem Modus wechseln, Schaltfläche" (Button to switch to dark mode)

---

## Deployment

### Development
```bash
npm run dev
# Access: http://localhost:3000
```

### Production (Docker)
```bash
docker-compose build
docker-compose up -d
# Access: http://localhost:3000
```

### Verify Production Build
```bash
npm run build
npm start
# Verify theme switcher works in production build
```

---

## Rollback Plan

If issues arise after deployment:

1. **Quick Fix**: Remove ThemeToggle from UI (users still get system detection)
2. **Full Rollback**: Revert commits related to theme switcher
3. **Data Safety**: No data migration needed (localStorage is optional)

**Rollback Commands**:
```bash
git revert [commit-hash]
docker-compose down
docker-compose build
docker-compose up -d
```

---

## Next Steps After Implementation

1. **Monitor User Feedback**: Check if users discover/use theme toggle
2. **Analytics** (optional): Track theme preference distribution (light/dark/system)
3. **Future Enhancements**:
   - Add "system" option to toggle cycle (light → dark → system)
   - Scheduled theme switching (auto dark mode at night)
   - Per-page theme preferences

---

## Documentation Updates

After implementation, update:

1. **CLAUDE.md**: Add theme switcher to "Active Technologies"
2. **README.md**: Add screenshot of dark mode (if README exists)
3. **User Guide** (if exists): Document how to toggle theme

---

## Completion Criteria

✅ **Feature Complete When**:
- All functional requirements validated
- All success criteria met
- Test coverage ≥ 80%
- All tests passing
- Docker deployment validated
- Documentation updated
- Code reviewed and merged to develop

**Estimated Total Time**: 6-9 hours (depending on component fixes needed)
