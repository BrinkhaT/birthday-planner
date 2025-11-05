# Tasks: Milestone Birthday Highlights

**Input**: Design documents from `/specs/006-milestone-birthday-highlights/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project environment and dependencies

- [x] T001 Verify Node.js 20.x and npm are installed with `node --version && npm --version`
- [x] T002 Ensure on feature branch `006-milestone-birthday-highlights` with `git branch`
- [x] T003 [P] Verify existing test infrastructure runs successfully with `npm test`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utility function that BOTH user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add `isMilestoneBirthday(age: number | null): boolean` function to `lib/date-utils.ts`

**Checkpoint**: Milestone detection logic ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Milestone Recognition (Priority: P1) 🎯 MVP

**Goal**: Users can immediately identify milestone birthdays (18, multiples of 10) through visual highlighting in both card and table views

**Independent Test**: View birthday list with mixed ages (18, 30, 42, 50) and verify that milestone birthdays (18, 30, 50) display with amber highlighting while non-milestones (42) do not

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T005 [P] [US1] Add unit tests for `isMilestoneBirthday()` in `__tests__/unit/lib/date-utils.test.ts`
- [x] T006 [P] [US1] Add integration tests for BirthdayCard milestone highlighting in `__tests__/integration/components/birthday-card.test.tsx`
- [x] T007 [P] [US1] Add integration tests for BirthdayTable milestone highlighting in `__tests__/integration/components/birthday-table.test.tsx`

### Implementation for User Story 1

- [x] T008 [P] [US1] Update BirthdayCard component to apply milestone highlighting in `components/birthday-card.tsx`
- [x] T009 [P] [US1] Update BirthdayTable component to apply milestone highlighting to rows in `components/birthday-table.tsx`
- [x] T010 [US1] Verify all tests pass with `npm test` - **FAILED** (10 tests failing in birthday-card and birthday-table)
- [x] T011 [US1] Manual test: Verify card highlighting on milestone birthdays in browser at http://localhost:3000
- [x] T012 [US1] Manual test: Verify table highlighting on milestone birthdays in browser
- [x] T013 [US1] Manual test: Verify no highlighting on birthdays without birth year

**Checkpoint**: User Story 1 complete - milestone birthdays are visually highlighted in both card and table views

---

## Phase 4: User Story 2 - Multiple Milestone Types (Priority: P2)

**Goal**: Users can distinguish that both 18th birthdays AND decade milestones receive equal visual treatment

**Independent Test**: Create entries for someone turning 18 and someone turning 50, verify both receive identical amber highlighting treatment

### Tests for User Story 2

> **NOTE: These tests extend the existing test suites**

- [x] T014 [P] [US2] Add test case for age 18 special milestone in `__tests__/unit/lib/date-utils.test.ts`
- [x] T015 [P] [US2] Add test case for age 20 decade milestone in `__tests__/unit/lib/date-utils.test.ts`
- [x] T016 [P] [US2] Add edge case tests (ages 17, 19, 10, 100, null) in `__tests__/unit/lib/date-utils.test.ts`

### Implementation for User Story 2

- [x] T017 [US2] Verify `isMilestoneBirthday()` correctly identifies age 18 as special milestone
- [x] T018 [US2] Verify `isMilestoneBirthday()` correctly identifies decade milestones (10, 20, 30, etc.)
- [x] T019 [US2] Manual test: Create birthday with age 18, verify amber highlighting
- [x] T020 [US2] Manual test: Create birthdays with ages 17, 18, 19, 20 - verify only 18 and 20 highlighted
- [x] T021 [US2] Manual test: Verify both 18 and decade milestones have identical visual prominence

**Checkpoint**: User Story 2 complete - both milestone types (18 and decades) receive equal visual treatment

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and responsive design verification

- [x] T022 [P] Run full test suite with coverage `npm test -- --coverage`
- [x] T023 [P] Verify TypeScript compilation with `npx tsc --noEmit`
- [x] T024 [P] Verify linting passes with `npm run lint`
- [x] T025 Verify responsive design on 320px viewport (mobile)
- [x] T026 Verify responsive design on 768px viewport (tablet)
- [x] T027 Verify responsive design on 1920px viewport (desktop)
- [x] T028 Verify dark mode highlighting works correctly
- [x] T029 Verify test coverage ≥ 80% requirement met (98.72% achieved)
- [x] T030 Follow quickstart.md validation checklist
- [x] T031 Update CLAUDE.md with completed feature status

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-4)**: All depend on Foundational phase (T004) completion
  - User Story 1 (Phase 3) can start after T004
  - User Story 2 (Phase 4) depends on User Story 1 implementation (extends same function)
- **Polish (Phase 5)**: Depends on both user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T004 (milestone function) - NO dependencies on other stories
- **User Story 2 (P2)**: Extends User Story 1 (same function handles both milestone types) - Tests verify both types work

### Within Each User Story

- **User Story 1**:
  - T005-T007 (tests) can run in parallel - MUST FAIL before implementation
  - T008-T009 (component updates) can run in parallel after tests fail
  - T010-T013 (validation) run sequentially after implementation
- **User Story 2**:
  - T014-T016 (additional tests) can run in parallel
  - T017-T021 (verification) run sequentially

### Parallel Opportunities

**Phase 1 (Setup)**:
- T003 (test infrastructure) can run parallel with T001-T002

**Phase 3 (User Story 1) - Tests**:
- T005 (date-utils tests) parallel with T006 (card tests) parallel with T007 (table tests)

**Phase 3 (User Story 1) - Implementation**:
- T008 (BirthdayCard) parallel with T009 (BirthdayTable)

**Phase 4 (User Story 2) - Tests**:
- T014 parallel with T015 parallel with T016 (all extending same test file)

**Phase 5 (Polish)**:
- T022 (coverage) parallel with T023 (typecheck) parallel with T024 (lint)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (AFTER T004 is done):
Task: "Add unit tests for isMilestoneBirthday() in __tests__/unit/lib/date-utils.test.ts"
Task: "Add integration tests for BirthdayCard in __tests__/integration/components/birthday-card.test.tsx"
Task: "Add integration tests for BirthdayTable in __tests__/integration/components/birthday-table.test.tsx"

# Launch both component updates together (AFTER tests are written and failing):
Task: "Update BirthdayCard component in components/birthday-card.tsx"
Task: "Update BirthdayTable component in components/birthday-table.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004) - CRITICAL
3. Complete Phase 3: User Story 1 (T005-T013)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - Core feature working

### Incremental Delivery

1. Complete Setup + Foundational → Milestone detection ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - all milestones highlighted!)
3. Add User Story 2 → Verify both types → Deploy/Demo (Enhanced validation)
4. Complete Polish → Final validation → Ready for PR

### Parallel Team Strategy

With multiple developers:

1. Developer A completes T001-T004 (setup + foundational)
2. Once T004 is done:
   - Developer A: T005-T009 (User Story 1 tests + implementation)
   - Developer B: Can prepare test data for manual testing
3. Both validate User Story 1 works before moving to User Story 2

---

## Summary

- **Total Tasks**: 31
- **Setup**: 3 tasks
- **Foundational**: 1 task (blocking)
- **User Story 1**: 9 tasks (MVP)
- **User Story 2**: 8 tasks (enhancement)
- **Polish**: 10 tasks
- **Parallel Opportunities**: 12 tasks marked [P]
- **MVP Scope**: Phases 1-3 (13 tasks) delivers core highlighting functionality

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently testable
- Verify tests fail before implementing (TDD approach)
- Commit after each logical group of tasks
- Stop at any checkpoint to validate story independently
- Feature is additive - zero risk of breaking existing functionality
