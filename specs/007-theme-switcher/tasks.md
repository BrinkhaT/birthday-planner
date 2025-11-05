# Tasks: Theme Switcher (Light/Dark Mode)

**Input**: Design documents from `/specs/007-theme-switcher/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-api.md

**Tests**: Included per Constitution Principle VII (Comprehensive Testing Infrastructure)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

**Next.js App Router structure**:
- `app/` - Next.js pages and layouts
- `components/` - React components
- `lib/` - Utilities and hooks
- `__tests__/` - Test files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing configuration and create directory structure

- [x] T001 Verify Tailwind dark mode configuration in tailwind.config.ts (should be `darkMode: ["class"]`)
- [x] T002 [P] Verify dark mode CSS variables in app/globals.css (should have `:root` and `.dark` selectors)
- [x] T003 [P] Create lib/hooks/ directory for custom hooks
- [x] T004 [P] Verify ShadCN Button component exists in components/ui/button.tsx
- [x] T005 [P] Verify Lucide React icons are installed (check package.json for lucide-react)

**Checkpoint**: All prerequisites verified - ready for foundational infrastructure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core theme infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create useTheme custom hook in lib/hooks/use-theme.ts with ThemeContext, state management, localStorage operations, matchMedia detection, and toggleTheme function
- [x] T007 Create ThemeProvider component in components/theme-provider.tsx implementing React Context provider with theme state, system preference detection, and DOM class application
- [x] T008 Add blocking FOUC prevention script to app/layout.tsx in `<head>` tag to apply theme before React hydration
- [x] T009 Add German theme localization strings to lib/i18n-de.ts (toggleLight, toggleDark, themeLabel)
- [x] T010 Wrap application in ThemeProvider in app/layout.tsx body with suppressHydrationWarning on html element

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - System Theme Detection (Priority: P1) 🎯 MVP

**Goal**: Automatically detect and apply user's operating system theme preference on first visit

**Independent Test**: Open application on devices with different system theme settings (light/dark) and verify app theme matches automatically

**Acceptance Scenarios**:
1. OS set to light mode → application displays in light theme
2. OS set to dark mode → application displays in dark theme
3. OS has no preference → application defaults to light theme

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US1] Create test mocks for localStorage in __tests__/mocks/localStorage.ts with getItem, setItem, clear methods
- [x] T012 [P] [US1] Create test mocks for matchMedia in __tests__/mocks/matchMedia.ts with matches property and event listeners
- [x] T013 [US1] Unit test for useTheme hook system preference detection in __tests__/unit/lib/use-theme.test.tsx (test light/dark/no-preference scenarios) - Fixed: renamed to .tsx for JSX support
- [x] T014 [US1] Unit test for useTheme hook initialization with system preference in __tests__/unit/lib/use-theme.test.tsx
- [x] T015 [US1] Integration test for system preference application on page load in __tests__/integration/theme-integration.test.tsx

### Implementation for User Story 1

- [x] T016 [US1] Implement system preference detection logic in lib/hooks/use-theme.ts using window.matchMedia('(prefers-color-scheme: dark)') - Already done in Phase 2 (T007)
- [x] T017 [US1] Implement system preference change listener in lib/hooks/use-theme.ts with addEventListener for matchMedia changes - Already done in Phase 2 (T007)
- [x] T018 [US1] Implement theme computation logic in useTheme hook (preference="system" → use systemPreference, else use stored preference) - Already done in Phase 2 (T007)
- [x] T019 [US1] Implement DOM class application in ThemeProvider (add/remove 'dark' class on document.documentElement) - Already done in Phase 2 (T007)
- [x] T020 [US1] Test blocking script prevents FOUC by manually setting localStorage and verifying no flash on reload - Already done in Phase 2 (T008)

**Checkpoint**: User Story 1 complete - system theme detection working, no manual toggle yet

---

## Phase 4: User Story 2 - Manual Theme Toggle (Priority: P2)

**Goal**: Allow users to manually switch between light and dark mode via toggle button, overriding system preference

**Independent Test**: Click theme toggle button and verify theme changes instantly, persists on refresh

**Acceptance Scenarios**:
1. App in light mode → click toggle → switches to dark mode immediately
2. App in dark mode → click toggle → switches to light mode immediately
3. User toggles manually → refresh page → manually selected theme is preserved

### Tests for User Story 2

- [ ] T021 [P] [US2] Unit test for ThemeToggle component rendering in __tests__/unit/components/theme-toggle.test.tsx (verify button, icon, ARIA label)
- [ ] T022 [P] [US2] Unit test for ThemeToggle click handler in __tests__/unit/components/theme-toggle.test.tsx (verify toggleTheme called)
- [ ] T023 [P] [US2] Unit test for icon changes based on theme in __tests__/unit/components/theme-toggle.test.tsx (Moon in light, Sun in dark)
- [ ] T024 [US2] Integration test for manual toggle flow in __tests__/integration/theme-integration.test.tsx (click → theme changes → DOM updated)
- [ ] T025 [US2] Integration test for toggle accessibility in __tests__/integration/theme-integration.test.tsx (keyboard navigation, ARIA labels)

### Implementation for User Story 2

- [ ] T026 [P] [US2] Create ThemeToggle component in components/theme-toggle.tsx with ShadCN Button, Sun/Moon icons from Lucide React
- [ ] T027 [US2] Implement toggleTheme function in useTheme hook (cycles light ↔ dark)
- [ ] T028 [US2] Add onClick handler to ThemeToggle calling toggleTheme from useTheme hook
- [ ] T029 [US2] Add German ARIA labels to ThemeToggle button using i18nTheme strings (changes based on current theme)
- [ ] T030 [US2] Add ThemeToggle to app/page.tsx header section for testing (temporary placement)
- [ ] T031 [US2] Verify theme toggle is visible and functional in both light and dark modes

**Checkpoint**: User Story 2 complete - manual toggle working, theme switches instantly

---

## Phase 5: User Story 3 - Theme Persistence (Priority: P3)

**Goal**: Remember user's manual theme selection across browser sessions

**Independent Test**: Manually select theme, close browser completely, reopen application, verify theme choice preserved

**Acceptance Scenarios**:
1. User selected dark mode → close/reopen browser → displays in dark mode
2. User selected light mode → close/reopen browser → displays in light mode
3. User never manually selected → application continues to respect system preference

### Tests for User Story 3

- [ ] T032 [P] [US3] Unit test for localStorage write on theme change in __tests__/unit/lib/use-theme.test.ts
- [ ] T033 [P] [US3] Unit test for localStorage read on initialization in __tests__/unit/lib/use-theme.test.ts
- [ ] T034 [P] [US3] Unit test for graceful degradation when localStorage unavailable in __tests__/unit/lib/use-theme.test.ts (try-catch error handling)
- [ ] T035 [US3] Integration test for persistence across simulated page reload in __tests__/integration/theme-integration.test.tsx
- [ ] T036 [US3] Integration test for manual selection override of system preference in __tests__/integration/theme-integration.test.tsx

### Implementation for User Story 3

- [ ] T037 [US3] Implement localStorage read in useTheme hook initialization (read 'theme-preference' key)
- [ ] T038 [US3] Implement localStorage write in setTheme function (write 'theme-preference' with try-catch for errors)
- [ ] T039 [US3] Implement preference validation logic in useTheme hook (validate stored value is "light", "dark", or "system", default to "system" if invalid)
- [ ] T040 [US3] Implement priority logic: manual selection > system preference in theme computation
- [ ] T041 [US3] Test persistence by setting theme, refreshing browser, verifying theme persists

**Checkpoint**: User Story 3 complete - theme preference persists across browser sessions

---

## Phase 6: Component Compatibility & Polish

**Purpose**: Ensure all existing components work in both themes and apply final polish

### Component Dark Mode Verification

- [ ] T042 [P] Audit components/birthday-card.tsx for hardcoded colors (search for bg-white, text-black, etc.), replace with semantic tokens if found
- [ ] T043 [P] Audit components/birthday-table.tsx for hardcoded colors, replace with semantic tokens if found
- [ ] T044 [P] Audit components/birthday-form.tsx for hardcoded colors, replace with semantic tokens if found
- [ ] T045 [P] Audit components/birthday-modal.tsx for hardcoded colors, replace with semantic tokens if found
- [ ] T046 [P] Audit components/delete-confirmation.tsx for hardcoded colors, replace with semantic tokens if found

### Visual Testing & WCAG Compliance

- [ ] T047 [P] Manual visual test: Load app in light mode, verify all components readable and styled correctly
- [ ] T048 [P] Manual visual test: Toggle to dark mode, verify all components readable and styled correctly
- [ ] T049 [P] Manual visual test: Verify no layout shift occurs when toggling theme
- [ ] T050 [P] Run Lighthouse accessibility audit in light mode, verify no contrast issues (WCAG AA 4.5:1)
- [ ] T051 [P] Run Lighthouse accessibility audit in dark mode, verify no contrast issues (WCAG AA 4.5:1)

### Coverage & Documentation

- [ ] T052 Run full test suite with coverage: `npm test -- --coverage` and verify 80%+ coverage for theme-related code
- [ ] T053 Review coverage report at coverage/lcov-report/index.html, add tests for any uncovered critical paths
- [ ] T054 Update CLAUDE.md to add theme switcher to "Active Technologies" and "Recent Changes" sections
- [ ] T055 Create permanent placement for ThemeToggle component in app layout (move from temporary test location)

### Docker Validation

- [ ] T056 Build Docker image: `docker-compose build` and verify build succeeds
- [ ] T057 Run Docker container: `docker-compose up -d` and verify app starts successfully
- [ ] T058 Test theme switcher in Docker environment: verify toggle works, theme persists, no console errors
- [ ] T059 Stop Docker container: `docker-compose down`

### Performance & Accessibility Final Checks

- [ ] T060 [P] Measure initial theme detection time (should be < 100ms from page load)
- [ ] T061 [P] Measure theme toggle time (should be < 50ms from click to DOM update)
- [ ] T062 [P] Test keyboard navigation: Tab to ThemeToggle, press Enter/Space to toggle, verify works
- [ ] T063 [P] Test screen reader: Enable VoiceOver/NVDA, navigate to ThemeToggle, verify German ARIA labels announced

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T005) - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion (T006-T010)
  - User Story 1 (Phase 3): Can start after Foundational - **MVP target**
  - User Story 2 (Phase 4): Builds on User Story 1 (needs useTheme hook from T006)
  - User Story 3 (Phase 5): Builds on User Story 2 (needs toggleTheme from T027)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - System Detection)**: Depends on Foundational (T006-T010) - Core MVP
- **User Story 2 (P2 - Manual Toggle)**: Depends on US1 completion (T011-T020) - Needs system detection working first
- **User Story 3 (P3 - Persistence)**: Depends on US2 completion (T021-T031) - Needs manual toggle working first

**Sequential Order Recommendation**: US1 → US2 → US3 (each builds on previous)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Test mocks (T011-T012) before tests (T013-T015)
- Tests (T013-T015, T021-T025, T032-T036) can run in parallel with [P] markers
- Implementation follows tests
- Core logic before UI components
- Verification/testing after implementation

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T002, T003, T004, T005 can all run in parallel (marked [P])

**User Story 1 Tests**:
- T011, T012 can run in parallel (both are mock creation)
- After mocks: T013, T014, T015 depend on mocks but can be written in parallel

**User Story 2 Tests**:
- T021, T022, T023 can run in parallel (marked [P])

**User Story 3 Tests**:
- T032, T033, T034 can run in parallel (marked [P])

**Component Audits (Phase 6)**:
- T042-T046 can all run in parallel (different files)
- T047-T051 can run in parallel (different test scenarios)
- T060-T063 can run in parallel (different metrics)

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all test mocks together:
Task: "Create test mocks for localStorage in __tests__/mocks/localStorage.ts"
Task: "Create test mocks for matchMedia in __tests__/mocks/matchMedia.ts"

# After mocks complete, launch all unit/integration tests together:
Task: "Unit test for useTheme hook system preference detection"
Task: "Unit test for useTheme hook initialization"
Task: "Integration test for system preference application"
```

---

## Parallel Example: Component Audits

```bash
# Launch all component audits together:
Task: "Audit components/birthday-card.tsx for hardcoded colors"
Task: "Audit components/birthday-table.tsx for hardcoded colors"
Task: "Audit components/birthday-form.tsx for hardcoded colors"
Task: "Audit components/birthday-modal.tsx for hardcoded colors"
Task: "Audit components/delete-confirmation.tsx for hardcoded colors"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) 🎯

**Fastest path to value: System theme detection**

1. Complete Phase 1: Setup (T001-T005) - ~15 minutes
2. Complete Phase 2: Foundational (T006-T010) - ~1-2 hours
3. Complete Phase 3: User Story 1 (T011-T020) - ~2-3 hours
4. **STOP and VALIDATE**: Test system theme detection independently
5. **MVP READY**: Users get automatic theme matching without manual control

**Total MVP Time**: ~4-6 hours
**MVP Value**: Automatic light/dark mode based on system preference

---

### Incremental Delivery

**Each phase adds value without breaking previous work**

1. **MVP (US1)**: System theme detection
   - Test independently ✅
   - Deploy/Demo possible
   - Value: Automatic theme matching

2. **+ User Story 2**: Manual toggle
   - Test independently ✅
   - Deploy/Demo
   - Value: User control over theme

3. **+ User Story 3**: Persistence
   - Test independently ✅
   - Deploy/Demo
   - Value: Theme preference remembered

4. **+ Polish (Phase 6)**: Component compatibility & validation
   - Full feature complete
   - Production ready

**Total Implementation Time**: ~6-9 hours (depending on component fixes)

---

### Full Feature Delivery Order

**Recommended Sequential Implementation**:

1. Phase 1: Setup (T001-T005)
2. Phase 2: Foundational (T006-T010) ← **CRITICAL BLOCKER**
3. Phase 3: User Story 1 (T011-T020) ← **MVP CHECKPOINT**
4. Phase 4: User Story 2 (T021-T031)
5. Phase 5: User Story 3 (T032-T041)
6. Phase 6: Polish (T042-T063)

**Checkpoints for Validation**:
- After Phase 2: Theme infrastructure ready
- After Phase 3: MVP (system detection) working ✅
- After Phase 4: Manual toggle working ✅
- After Phase 5: Persistence working ✅
- After Phase 6: Production ready ✅

---

## Task Summary

**Total Tasks**: 63

**Breakdown by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 5 tasks ← **BLOCKS all user stories**
- Phase 3 (US1 - System Detection): 10 tasks (5 tests + 5 implementation)
- Phase 4 (US2 - Manual Toggle): 11 tasks (5 tests + 6 implementation)
- Phase 5 (US3 - Persistence): 10 tasks (5 tests + 5 implementation)
- Phase 6 (Polish): 22 tasks (component audits, testing, validation, Docker)

**Test Tasks**: 15 unit/integration tests (24% of total - ensures quality)

**Parallelizable Tasks**: 23 tasks marked [P] (37% can run in parallel)

**MVP Scope**: Phases 1-3 only (20 tasks, ~4-6 hours)

**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

---

## Notes

- [P] tasks = different files, no dependencies, safe to parallelize
- [US1/US2/US3] labels map tasks to specific user stories for traceability
- Each user story should be independently testable at its checkpoint
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Theme switcher is a low-risk feature (client-side only, no data migration)
- Existing components should adapt automatically (using semantic Tailwind tokens)
- Constitution Principle VII requires 80%+ test coverage - we have 15 test tasks to ensure compliance
