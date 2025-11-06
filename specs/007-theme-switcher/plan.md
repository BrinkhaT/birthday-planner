# Implementation Plan: Theme Switcher (Light/Dark Mode)

**Branch**: `007-theme-switcher` | **Date**: 2025-11-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-theme-switcher/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a light/dark mode theme switcher that automatically detects the user's operating system preference and allows manual override with persistence across browser sessions. All existing UI components (birthday cards, tables, forms, modals) must adapt to both theme modes while maintaining WCAG AA accessibility standards.

## Technical Context

**Language/Version**: TypeScript 5.9+ / Node.js 20.x
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS, ShadCN UI components
**Storage**: Browser localStorage for theme preference persistence
**Testing**: Jest 29.x with React Testing Library 16.x (per Constitution Principle VII)
**Target Platform**: Modern web browsers with CSS media query support (`prefers-color-scheme`)
**Project Type**: Web application (Next.js App Router with server components)
**Performance Goals**:
- Theme detection within 100ms of page load
- Theme toggle within 50ms without page refresh
- Zero layout shift on theme change
**Constraints**:
- Must support all existing UI components (birthday cards, tables, forms, modals)
- WCAG AA contrast ratios (4.5:1 for normal text)
- Graceful degradation when localStorage unavailable
- No external dependencies (client-side only)
**Scale/Scope**: Single-page application, ~6-8 existing components to adapt, browser-only state management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: SpecKit-Driven Development
- Specification created via `/speckit.specify` ✅
- Planning in progress via `/speckit.plan` ✅
- Tasks will be generated via `/speckit.tasks` after planning ✅

### ✅ Principle II: Simplicity First
- Uses browser-native APIs (`prefers-color-scheme`, localStorage) ✅
- No external theme libraries or frameworks ✅
- Tailwind CSS dark mode (already in project) - no new dependencies ✅
- Simple state management (React hooks only) ✅

### ✅ Principle III: Responsive Design
- Theme switcher UI will use ShadCN components ✅
- Mobile-first approach (theme toggle accessible on all screen sizes) ✅
- All existing responsive components adapt to both themes ✅

### ✅ Principle IV: Docker-First Deployment
- No Docker changes required (browser-only feature) ✅
- localStorage is client-side (no volume mount changes) ✅

### ✅ Principle V: Optional Authentication
- No authentication changes required ✅
- Theme switcher accessible to all users (authenticated or not) ✅

### ✅ Principle VI: German Localization
- Theme toggle labels will be in German (e.g., "Hell/Dunkel" or "Theme") ✅
- All existing German text remains visible in both themes ✅
- No date/number formatting changes (display-only feature) ✅

### ✅ Principle VII: Comprehensive Testing Infrastructure
- Unit tests for theme detection logic ✅
- Unit tests for localStorage persistence ✅
- Integration tests for theme toggle component ✅
- Tests for all existing components in both themes ✅
- Target: 80%+ coverage following established patterns ✅

### Technology Stack Compliance
- ✅ Next.js 16 (App Router) - already in use
- ✅ React 19 - already in use
- ✅ Tailwind CSS - already supports dark mode via `dark:` prefix
- ✅ ShadCN UI components - already in use
- ✅ Jest 29.x + React Testing Library 16.x - already configured
- ✅ No new dependencies required

**GATE STATUS**: ✅ PASSED - All constitutional principles satisfied, no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── layout.tsx           # Root layout - add ThemeProvider here
├── page.tsx             # Home page - already renders birthday components
└── globals.css          # Add dark mode color variables

components/
├── ui/                  # ShadCN components (existing)
│   └── [existing components adapt to dark mode automatically]
├── theme-provider.tsx   # NEW: React Context for theme state
├── theme-toggle.tsx     # NEW: Toggle button component
├── birthday-card.tsx    # MODIFY: Ensure dark mode compatibility
├── birthday-table.tsx   # MODIFY: Ensure dark mode compatibility
├── birthday-form.tsx    # MODIFY: Ensure dark mode compatibility
├── birthday-modal.tsx   # MODIFY: Ensure dark mode compatibility
└── delete-confirmation.tsx  # MODIFY: Ensure dark mode compatibility

lib/
├── hooks/
│   └── use-theme.ts     # NEW: Custom hook for theme management
└── i18n-de.ts           # MODIFY: Add German theme labels

__tests__/
├── unit/
│   ├── lib/
│   │   └── use-theme.test.ts          # NEW: Theme hook tests
│   └── components/
│       └── theme-toggle.test.tsx       # NEW: Toggle component tests
└── integration/
    └── theme-integration.test.tsx      # NEW: Full theme switching flow tests

tailwind.config.ts       # VERIFY: Dark mode enabled (should be class-based)
```

**Structure Decision**: Next.js App Router structure (existing). This feature adds:
- New theme management components (`theme-provider.tsx`, `theme-toggle.tsx`)
- New custom hook (`use-theme.ts`) for theme state management
- Updates to existing components to ensure dark mode compatibility
- Comprehensive tests following established patterns in `__tests__/`

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No constitutional violations** - This feature fully complies with all principles.

---

## Post-Design Constitution Re-Evaluation

*Re-evaluated after Phase 0 (research.md) and Phase 1 (data-model.md, contracts/, quickstart.md) completion*

### Design Artifacts Review

**Phase 0 - Research Decisions** (research.md):
- ✅ Uses browser-native APIs (matchMedia, localStorage, classList)
- ✅ No external theme libraries (maintains simplicity)
- ✅ Tailwind dark mode already configured (no new dependencies)
- ✅ WCAG AA contrast compliance design
- ✅ German localization strings planned

**Phase 1 - Data Model** (data-model.md):
- ✅ Client-side only (no server-side complexity)
- ✅ Simple localStorage schema (single key-value)
- ✅ Graceful degradation when storage unavailable
- ✅ No API endpoints required

**Phase 1 - Component Contracts** (contracts/component-api.md):
- ✅ ShadCN Button component (existing dependency)
- ✅ Lucide React icons (existing dependency)
- ✅ React Context API (built-in, no library)
- ✅ Mobile-friendly (44x44px tap targets)

**Phase 1 - Quickstart Guide** (quickstart.md):
- ✅ Comprehensive testing plan (80%+ coverage target)
- ✅ Docker validation included
- ✅ Accessibility validation (WCAG, keyboard, screen reader)
- ✅ Performance benchmarks defined

### Constitutional Compliance Confirmation

All design decisions align with constitutional principles:

1. **Principle I (SpecKit)**: ✅ Followed workflow (specify → plan → tasks next)
2. **Principle II (Simplicity)**: ✅ Zero new dependencies, browser APIs only
3. **Principle III (Responsive)**: ✅ ShadCN components, mobile-first
4. **Principle IV (Docker)**: ✅ No container changes needed
5. **Principle V (Auth)**: ✅ No authentication changes
6. **Principle VI (German)**: ✅ i18nTheme strings defined
7. **Principle VII (Testing)**: ✅ Unit + integration tests planned, 80%+ coverage

**GATE STATUS**: ✅ PASSED - Design fully compliant with Birthday Planner Constitution v2.1.0

---

## Planning Summary

**Artifacts Generated**:
- ✅ `plan.md` - This implementation plan
- ✅ `research.md` - Technical decisions and alternatives (10 decisions documented)
- ✅ `data-model.md` - Theme state and persistence schema
- ✅ `contracts/component-api.md` - Component interfaces and contracts
- ✅ `quickstart.md` - Step-by-step implementation guide

**Key Technical Decisions**:
1. CSS media query (`prefers-color-scheme`) for system detection
2. React Context API for state management
3. localStorage for persistence (graceful degradation)
4. Tailwind class-based dark mode (already configured)
5. Blocking script to prevent FOUC
6. ShadCN Button with Lucide icons for toggle UI

**Implementation Readiness**:
- All unknowns resolved ✅
- Design patterns established ✅
- Component structure defined ✅
- Testing strategy documented ✅
- Performance targets set ✅
- Accessibility requirements defined ✅

**Next Command**: `/speckit.tasks` to generate ordered task list for implementation
