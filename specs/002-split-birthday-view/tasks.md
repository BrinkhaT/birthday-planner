# Tasks: Split Birthday View

**Input**: Design documents from `/specs/002-split-birthday-view/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-components.md

**Tests**: Not requested for this feature - manual testing only (see quickstart.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Next.js App Router structure
- `app/` - Next.js page components
- `components/` - React components
- `lib/` - Utility functions
- `types/` - TypeScript type definitions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and type definitions needed by all user stories

- [X] T001 Add BirthdayWithOccurrence type extending Birthday in types/birthday.ts
- [X] T002 [P] Add ParsedDate interface in types/birthday.ts
- [X] T003 [P] Add DateRange and BirthdayRanges interfaces in types/birthday.ts
- [X] T004 [P] Add SplitBirthdays interface in types/birthday.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core date utility functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create lib/date-utils.ts file with parseBirthDate function
- [X] T006 Implement isLeapYear helper function in lib/date-utils.ts
- [X] T007 Implement getNextOccurrence function with leap year handling in lib/date-utils.ts
- [X] T008 Implement calculateAge function with null handling in lib/date-utils.ts
- [X] T009 Implement sortBirthdays function with two-level sort in lib/date-utils.ts
- [X] T010 Implement splitBirthdays function with date range logic in lib/date-utils.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Upcoming Birthdays (Priority: P1) 🎯 MVP

**Goal**: Display birthdays in next 30 days as cards, sorted by date ascending

**Independent Test**: Navigate to home page and verify all birthdays within next 30 days display as cards sorted by date. Empty state appears when no upcoming birthdays exist.

### Implementation for User Story 1

- [X] T011 [US1] Import date utility functions in app/page.tsx
- [X] T012 [US1] Add useMemo hook to compute split birthdays in app/page.tsx
- [X] T013 [US1] Add Section 1 heading "Upcoming Birthdays (Next 30 Days)" with aria-labelledby in app/page.tsx
- [X] T014 [US1] Add conditional rendering for Section 1 empty state in app/page.tsx
- [X] T015 [US1] Modify Section 1 grid to map over upcoming array instead of all birthdays in app/page.tsx
- [X] T016 [US1] Verify BirthdayCard component shows age correctly when birth year available
- [X] T017 [US1] Verify BirthdayCard component hides age when birth year unavailable

**Checkpoint**: At this point, User Story 1 (Section 1 - Upcoming Birthdays) should be fully functional and testable independently

---

## Phase 4: User Story 2 - Review All Other Birthdays (Priority: P2)

**Goal**: Display birthdays beyond 30 days (day 31 through yesterday + 1 year) in table format

**Independent Test**: Verify Section 2 displays all birthdays not shown in Section 1 in a table with Date, Name, Age columns. Empty state appears when no future birthdays exist.

### Implementation for User Story 2

- [X] T018 [P] [US2] Create components/birthday-table.tsx with BirthdayTableProps interface
- [X] T019 [US2] Import ShadCN Table components in components/birthday-table.tsx
- [X] T020 [US2] Implement BirthdayTable component with TableHeader containing Date, Name, Age columns
- [X] T021 [US2] Implement TableBody with map over birthdays array in components/birthday-table.tsx
- [X] T022 [US2] Add date formatting for nextOccurrence display in components/birthday-table.tsx
- [X] T023 [US2] Add age display with "—" em dash for null age in components/birthday-table.tsx
- [X] T024 [US2] Add empty state message handling with emptyMessage prop in components/birthday-table.tsx
- [X] T025 [US2] Add responsive wrapper with overflow-x-auto for mobile scrolling in components/birthday-table.tsx
- [X] T026 [US2] Import BirthdayTable component in app/page.tsx
- [X] T027 [US2] Add Section 2 heading "All Other Birthdays" with aria-labelledby in app/page.tsx
- [X] T028 [US2] Add BirthdayTable component rendering future array in app/page.tsx
- [X] T029 [US2] Pass emptyMessage="No other birthdays to display" prop to BirthdayTable

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Responsive Layout Across Devices (Priority: P3)

**Goal**: Ensure both sections adapt gracefully to different screen sizes (320px-1920px)

**Independent Test**: View page on mobile (320px), tablet (768px), and desktop (1920px) viewports and verify layout remains functional and readable.

### Implementation for User Story 3

- [X] T030 [P] [US3] Verify Section 1 grid uses responsive classes grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 in app/page.tsx
- [X] T031 [P] [US3] Verify Section 1 gap uses responsive classes gap-4 sm:gap-6 in app/page.tsx
- [X] T032 [P] [US3] Add responsive spacing to Section 2 container with margin classes in app/page.tsx
- [X] T033 [US3] Test table horizontal scroll on mobile viewport (320px width) using browser DevTools
- [X] T034 [US3] Test card grid layout on tablet viewport (768px width) using browser DevTools
- [X] T035 [US3] Test full layout on desktop viewport (1920px width) using browser DevTools
- [X] T036 [US3] Verify touch targets are minimum 44px on mobile for accessibility
- [X] T037 [US3] Verify text remains readable without zooming on all viewports

**Checkpoint**: All user stories should now be independently functional across all devices

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation across all user stories

- [X] T038 [P] Verify partition completeness invariant (upcoming + future = total birthdays)
- [X] T039 [P] Test edge case: birthday exactly 30 days from today appears in Section 1
- [X] T040 [P] Test edge case: birthday on today's date appears in Section 1
- [X] T041 [P] Test edge case: Feb 29 birthday displays as Feb 28 in non-leap years
- [X] T042 [P] Test edge case: year boundary handling (December birthdays when testing in January)
- [X] T043 [P] Test sorting: multiple birthdays on same date sorted alphabetically by name
- [X] T044 [P] Verify semantic HTML with proper section and h2 tags
- [X] T045 [P] Verify ARIA labels (aria-labelledby) link sections to headings
- [X] T046 [P] Test keyboard navigation through sections (tab order)
- [X] T047 [P] Verify color contrast meets WCAG AA standards using browser DevTools
- [X] T048 Run full quickstart.md validation checklist
- [X] T049 Manual performance check: page load < 1 second, calculations < 20ms

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - P1 must be complete and tested before P2 begins
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 completion for context
- **User Story 3 (P3)**: Can start after US1 and US2 complete - Validates responsive behavior across both sections

### Within Each User Story

**User Story 1**:
- T011-T015: Sequential modifications to page component
- T016-T017: Parallel verification tasks

**User Story 2**:
- T018-T025: Create BirthdayTable component (sequential)
- T026-T029: Integrate into page (sequential, depends on T018-T025)

**User Story 3**:
- T030-T032: Parallel responsive class verification
- T033-T037: Sequential viewport testing

### Parallel Opportunities

- **Phase 1 (Setup)**: All type definition tasks (T001-T004) can run in parallel
- **Phase 2 (Foundational)**: All utility functions within lib/date-utils.ts are sequential (T005-T010) - they depend on each other
- **Phase 3 (US1)**: T016-T017 can run in parallel
- **Phase 4 (US2)**: T018 (create file) must complete first, then T019-T025 depend on it, then T026-T029 integrate it
- **Phase 5 (US3)**: T030-T032 can run in parallel
- **Phase 6 (Polish)**: T038-T047 can all run in parallel

---

## Parallel Example: Setup Phase

```bash
# Launch all type definition tasks together:
Task: "Add BirthdayWithOccurrence type extending Birthday in types/birthday.ts"
Task: "Add ParsedDate interface in types/birthday.ts"
Task: "Add DateRange and BirthdayRanges interfaces in types/birthday.ts"
Task: "Add SplitBirthdays interface in types/birthday.ts"
```

## Parallel Example: Polish Phase

```bash
# Launch all edge case tests together:
Task: "Verify partition completeness invariant"
Task: "Test edge case: birthday exactly 30 days from today"
Task: "Test edge case: birthday on today's date"
Task: "Test edge case: Feb 29 birthday in non-leap years"
Task: "Test edge case: year boundary handling"
Task: "Test sorting with same-date birthdays"
Task: "Verify semantic HTML"
Task: "Verify ARIA labels"
Task: "Test keyboard navigation"
Task: "Verify color contrast"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T010) - CRITICAL
3. Complete Phase 3: User Story 1 (T011-T017)
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md
5. Deploy/demo MVP: Section 1 with upcoming birthdays

**MVP Scope**: 17 tasks (Phase 1 + Phase 2 + Phase 3)

### Incremental Delivery

1. **MVP**: Complete Setup + Foundational + US1 → Test Section 1 → Deploy (17 tasks)
2. **Enhanced**: Add US2 → Test Section 2 → Deploy (17 + 12 = 29 tasks)
3. **Complete**: Add US3 → Validate responsive → Deploy (29 + 8 = 37 tasks)
4. **Polish**: Final validation → Production ready (37 + 12 = 49 tasks)

Each increment adds value without breaking previous functionality.

### Sequential Implementation (Single Developer)

1. Phase 1: Setup (4 tasks) - ~30 minutes
2. Phase 2: Foundational (6 tasks) - ~2 hours
3. Phase 3: User Story 1 (7 tasks) - ~1.5 hours
4. **Checkpoint**: Test MVP
5. Phase 4: User Story 2 (12 tasks) - ~2 hours
6. **Checkpoint**: Test both sections
7. Phase 5: User Story 3 (8 tasks) - ~1 hour
8. **Checkpoint**: Test responsive behavior
9. Phase 6: Polish (12 tasks) - ~1.5 hours
10. **Final**: Full validation with quickstart.md

**Total Estimated Time**: ~8-10 hours for complete feature

---

## Notes

- [P] tasks = different files or independent verification, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests - manual testing using quickstart.md validation guide
- Commit after completing each phase or user story
- Stop at any checkpoint to validate story independently
- All modifications maintain existing BirthdayCard component (no changes needed)
- No API changes required - existing /api/birthdays endpoint unchanged
- No Docker changes required - existing configuration works

---

## Task Count Summary

- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 6 tasks
- **Phase 3 (User Story 1)**: 7 tasks
- **Phase 4 (User Story 2)**: 12 tasks
- **Phase 5 (User Story 3)**: 8 tasks
- **Phase 6 (Polish)**: 12 tasks

**Total Tasks**: 49

**Parallel Opportunities**: 15 tasks marked [P] can run in parallel within their phases

**MVP Scope** (Recommended): Phases 1-3 (17 tasks) - delivers Section 1 with upcoming birthdays

**Independent Test Criteria**:
- US1: Section 1 displays upcoming birthdays as cards, sorted by date
- US2: Section 2 displays future birthdays in table format
- US3: Both sections responsive across 320px-1920px viewports
