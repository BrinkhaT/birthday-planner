---
description: "Task list for Birthday Entry Management (CRUD Operations)"
---

# Tasks: Birthday Entry Management (CRUD Operations)

**Input**: Design documents from `/specs/003-crud-operations/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: No automated tests requested - manual browser testing only (per research.md decision)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a Next.js App Router web application:
- `app/` - Next.js App Router (pages, layouts, API routes)
- `components/` - React components
- `components/ui/` - ShadCN UI components
- `lib/` - Utility functions and services
- `types/` - TypeScript type definitions
- `data/` - JSON FileStore (Docker volume mount)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install ShadCN Dialog component and verify prerequisites

- [x] T001 Install ShadCN Dialog component using `npx shadcn@latest add dialog` in project root
- [x] T002 [P] Verify existing birthday list display works at http://localhost:3000
- [x] T003 [P] Verify GET /api/birthdays endpoint returns data successfully

**Checkpoint**: ShadCN Dialog installed, existing features functional

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components and utilities needed by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create validation utilities in lib/validations.ts with functions: validateBirthdayName(name), validateBirthdayDate(birthdate)
- [x] T005 [P] Create German localization strings file lib/i18n-de.ts with modal titles, button labels, validation messages (see research.md)
- [x] T006 Create BirthdayForm component in components/birthday-form.tsx with name and birthdate inputs, German labels, client-side validation
- [x] T007 Create BirthdayModal wrapper component in components/birthday-modal.tsx with state management (useState for isOpen/mode/selectedBirthday) and Dialog integration
- [x] T008 Create DeleteConfirmation dialog component in components/delete-confirmation.tsx with German confirmation text

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Birthday Entry (Priority: P1) 🎯 MVP

**Goal**: Users can add new birthday entries via modal dialog with form validation

**Independent Test**: Click "Add" button → fill name and birthdate → submit → new birthday appears in list immediately

### Implementation for User Story 1

- [x] T009 [P] [US1] Add "Add" icon button (Plus icon from Lucide) to app/page.tsx in prominent location with German label "Geburtstag hinzufügen"
- [x] T010 [P] [US1] Create POST /api/birthdays/create route handler in app/api/birthdays/create/route.ts accepting CreateBirthdayRequest, generating UUID, adding timestamps, writing to FileStore
- [x] T011 [US1] Wire Add button to open BirthdayModal in 'add' mode in app/page.tsx
- [x] T012 [US1] Implement form submit handler in BirthdayModal for add mode: validate input, call POST endpoint, optimistic update using useOptimistic, close modal on success
- [x] T013 [US1] Add error handling and German error message display in BirthdayModal for failed add operations
- [x] T014 [US1] Test add flow end-to-end: empty validation, invalid date, successful add, data persistence after page refresh

**Checkpoint**: User Story 1 (Add Birthday) is fully functional and independently testable

---

## Phase 4: User Story 2 - Edit Existing Birthday Entry (Priority: P2)

**Goal**: Users can update existing birthday entries via modal dialog with pre-filled form

**Independent Test**: Click "Edit" icon on birthday card → modify name or birthdate → save → changes appear immediately

### Implementation for User Story 2

- [x] T015 [P] [US2] Add "Edit" icon buttons (Edit icon from Lucide) to each birthday entry in components/birthday-card.tsx with German tooltip "Geburtstag bearbeiten"
- [x] T016 [P] [US2] Add "Edit" icon buttons (Edit icon from Lucide) to each row in components/birthday-table.tsx with German tooltip "Geburtstag bearbeiten"
- [x] T017 [P] [US2] Create PUT /api/birthdays/[id]/route.ts route handler accepting id parameter and UpdateBirthdayRequest, updating birthday, updating updatedAt timestamp, writing to FileStore
- [x] T018 [US2] Wire Edit buttons to open BirthdayModal in 'edit' mode with selectedBirthday in components/birthday-card.tsx and components/birthday-table.tsx
- [x] T019 [US2] Implement form pre-fill logic in BirthdayForm when in edit mode (populate name and birthdate from selectedBirthday)
- [x] T020 [US2] Implement form submit handler in BirthdayModal for edit mode: validate input, call PUT endpoint, optimistic update, close modal on success
- [x] T021 [US2] Add error handling for edit operations (404 if birthday not found, validation errors, save failures)
- [x] T022 [US2] Test edit flow end-to-end: validation on empty fields, successful update, cancel without saving, data persistence

**Checkpoint**: User Stories 1 AND 2 are both functional and independently testable

---

## Phase 5: User Story 3 - Delete Birthday Entry with Confirmation (Priority: P3)

**Goal**: Users can safely delete birthday entries with mandatory confirmation dialog

**Independent Test**: Click "Delete" icon → confirmation dialog appears → confirm → birthday disappears immediately from list

### Implementation for User Story 3

- [x] T023 [P] [US3] Add "Delete" icon buttons (Trash2 icon from Lucide) to each birthday entry in components/birthday-card.tsx with German tooltip "Geburtstag löschen"
- [x] T024 [P] [US3] Add "Delete" icon buttons (Trash2 icon from Lucide) to each row in components/birthday-table.tsx with German tooltip "Geburtstag löschen"
- [x] T025 [P] [US3] Create DELETE handler in app/api/birthdays/[id]/route.ts accepting id parameter, removing birthday from FileStore, returning success message
- [x] T026 [US3] Wire Delete buttons to open DeleteConfirmation dialog with selectedBirthday in components/birthday-card.tsx and components/birthday-table.tsx
- [x] T027 [US3] Implement delete confirmation handler in DeleteConfirmation component: show birthday name in confirmation text, call DELETE endpoint on confirm, optimistic update on success
- [x] T028 [US3] Add error handling for delete operations (404 if birthday not found, FileStore write errors)
- [x] T029 [US3] Test delete flow end-to-end: cancel without deleting, successful delete, delete last birthday, data persistence

**Checkpoint**: All user stories (US1, US2, US3) are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [x] T030 [P] Ensure all icon buttons have minimum 44x44px tap targets for mobile accessibility in components/birthday-card.tsx and components/birthday-table.tsx
- [x] T031 [P] Verify responsive behavior of modals on 320px mobile width (test all modals)
- [x] T032 [P] Verify responsive behavior of modals on 1920px desktop width (test all modals)
- [x] T033 [P] Ensure ESC key closes all modals (Dialog component should handle this automatically)
- [x] T034 [P] Ensure click-outside closes modals (Dialog component should handle this automatically)
- [x] T035 Test all German localization strings display correctly (no English text, proper umlauts for ä/ö/ü)
- [x] T036 Test date format displays as DD.MM.YYYY everywhere (not ISO format or MM/DD/YYYY)
- [x] T037 Run complete manual test checklist from quickstart.md (functional tests, UI/UX tests, data persistence, edge cases)
- [x] T038 Test Docker deployment: build image, start container, verify CRUD operations, verify data persists after container restart
- [x] T039 Code cleanup: remove console.logs, unused imports, ensure TypeScript strict mode compliance
- [x] T040 Update CLAUDE.md with implementation notes if needed (feature complete)

**Checkpoint**: Feature complete and production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel (if staffed) OR
  - Sequentially in priority order: US1 → US2 → US3
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Shares components with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Shares components with US1/US2 but independently testable

### Within Each User Story

- API route implementations can proceed in parallel with UI changes (different files)
- Icon button additions (birthday-card.tsx, birthday-table.tsx) can be done in parallel
- Modal wiring must happen after modal components exist (from Foundational phase)
- Testing should happen after all tasks in that story are complete

### Parallel Opportunities

**Setup Phase**:
- T002 and T003 can run in parallel (independent verification tasks)

**Foundational Phase**:
- T004, T005 can run in parallel (different files: validations.ts, i18n-de.ts)
- T006, T007, T008 must be sequential (T007 depends on T006 being done first for import)

**User Story 1**:
- T009 (Add button UI) and T010 (POST API) can run in parallel
- T011, T012, T013 are sequential (wire → implement → error handling)

**User Story 2**:
- T015 and T016 can run in parallel (both add Edit buttons, different files)
- T017 (PUT API) can run in parallel with T015/T016
- T018, T019, T020 are sequential

**User Story 3**:
- T023 and T024 can run in parallel (both add Delete buttons, different files)
- T025 (DELETE API) can run in parallel with T023/T024
- T026, T027, T028 are sequential

**Polish Phase**:
- T030, T031, T032, T033, T034 can all run in parallel (independent checks)
- T035, T036 can run in parallel
- T037, T038 should be sequential (Docker test after manual tests)

---

## Parallel Example: User Story 1

```bash
# Launch UI and API tasks together:
Task T009: "Add 'Add' icon button to app/page.tsx"
Task T010: "Create POST /api/birthdays/create route"

# Then proceed sequentially:
Task T011: "Wire Add button to BirthdayModal"
Task T012: "Implement form submit handler"
Task T013: "Add error handling"
Task T014: "Test add flow end-to-end"
```

---

## Parallel Example: User Story 2

```bash
# Launch all Edit button and API tasks together:
Task T015: "Add Edit buttons to birthday-card.tsx"
Task T016: "Add Edit buttons to birthday-table.tsx"
Task T017: "Create PUT /api/birthdays/[id]/route.ts"

# Then proceed sequentially:
Task T018: "Wire Edit buttons to BirthdayModal"
Task T019: "Implement form pre-fill logic"
Task T020: "Implement edit submit handler"
Task T021: "Add error handling"
Task T022: "Test edit flow end-to-end"
```

---

## Parallel Example: User Story 3

```bash
# Launch all Delete button and API tasks together:
Task T023: "Add Delete buttons to birthday-card.tsx"
Task T024: "Add Delete buttons to birthday-table.tsx"
Task T025: "Create DELETE handler in route.ts"

# Then proceed sequentially:
Task T026: "Wire Delete buttons to DeleteConfirmation"
Task T027: "Implement delete confirmation handler"
Task T028: "Add error handling"
Task T029: "Test delete flow end-to-end"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (5 tasks) - CRITICAL
3. Complete Phase 3: User Story 1 (6 tasks)
4. **STOP and VALIDATE**: Test User Story 1 independently (can add birthdays)
5. Deploy/demo if ready

**MVP Scope**: Phases 1 + 2 + 3 = 14 tasks total

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (8 tasks)
2. Add User Story 1 → Test independently → Deploy/Demo (6 tasks, 14 total) 🎯 MVP!
3. Add User Story 2 → Test independently → Deploy/Demo (8 tasks, 22 total)
4. Add User Story 3 → Test independently → Deploy/Demo (7 tasks, 29 total)
5. Polish phase → Production ready (11 tasks, 40 total)

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (8 tasks)
2. Once Foundational is done, stories can proceed in parallel:
   - Developer A: User Story 1 (6 tasks)
   - Developer B: User Story 2 (8 tasks)
   - Developer C: User Story 3 (7 tasks)
3. Stories complete and integrate independently
4. Team reconvenes for Polish phase (11 tasks)

---

## Task Summary

**Total Tasks**: 40

**By Phase**:
- Setup: 3 tasks
- Foundational: 5 tasks
- User Story 1 (P1): 6 tasks 🎯 MVP
- User Story 2 (P2): 8 tasks
- User Story 3 (P3): 7 tasks
- Polish: 11 tasks

**Parallel Opportunities**: 18 tasks marked [P] can run in parallel within their phase

**MVP Scope** (Phases 1-3): 14 tasks

**Full Feature** (All phases): 40 tasks

---

## Notes

- [P] tasks = different files, no dependencies within current work
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Stop at any checkpoint to validate story independently
- Commit after each task or logical group
- All UI text must be in German (verified in T035)
- All dates must display as DD.MM.YYYY (verified in T036)
- Manual testing only (no automated test tasks per research.md)
- Avoid: vague tasks, same file conflicts, cross-story dependencies
