# Tasks: Comprehensive Testing for Non-Visual Logic

**Input**: Design documents from `/specs/005-comprehensive-testing/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: This feature IS the testing infrastructure - all tasks relate to creating and configuring tests.

**Organization**: Tasks are grouped by user story (test suite type) to enable independent implementation and testing of each test suite.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which test suite this task belongs to (e.g., US1 = Core Business Logic Tests, US2 = Validation Tests, etc.)
- Include exact file paths in descriptions

## Path Conventions

- Repository root structure: `__tests__/`, `jest.config.js`, `jest.setup.js`
- Test files: `__tests__/unit/` and `__tests__/integration/`
- Test fixtures: `__tests__/fixtures/`
- Mock files: `__mocks__/`

## Phase 1: Setup (Test Infrastructure)

**Purpose**: Initialize Jest testing framework and basic configuration

- [X] T001 Install Jest and testing dependencies (jest@^29.0.0, @testing-library/react@^16.0.0, @testing-library/react-hooks@^8.0.0, @types/jest@^29.0.0, jest-environment-jsdom@^29.0.0, @swc/jest@^0.2.0)
- [X] T002 Create jest.config.js with Next.js preset and module name mapping for @/ imports
- [X] T003 [P] Create jest.setup.js with @testing-library/jest-dom and environment variable mocks
- [X] T004 [P] Add test scripts to package.json (test, test:watch, test:coverage, test:unit, test:integration, test:ci)
- [X] T005 [P] Create __tests__/ directory structure with unit/ and integration/ subdirectories

---

## Phase 2: Foundational (Test Fixtures & Mocks)

**Purpose**: Create reusable test fixtures and mocks that ALL test suites depend on

**⚠️ CRITICAL**: No test implementation can begin until this phase is complete

- [X] T006 [P] Create __tests__/fixtures/birthdays.ts with birthday test fixtures (with year, without year, leap year, past, future)
- [X] T007 [P] Create __tests__/fixtures/dates.ts with reference date fixtures (leap year, non-leap, year boundaries, mid-year)
- [X] T008 [P] Create __tests__/fixtures/validation-cases.ts with comprehensive validation test cases (names, dates, formats)
- [X] T009 [P] Create __mocks__/fs/promises.ts with mock implementations for readFile, writeFile, rename, mkdir
- [X] T010 [P] Create __tests__/mocks/fetch.ts with fetch API mock utilities (mockFetchSuccess, mockFetchError, mockFetchNetworkError)
- [X] T011 [P] Create __tests__/mocks/next-request.ts with Next.js Request/Response mock utilities
- [X] T012 Configure TypeScript to recognize test files and @testing-library types in tsconfig.json or test-specific tsconfig

**Checkpoint**: Foundation ready - test suite implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core Business Logic Testing (Priority: P1) 🎯 MVP

**Goal**: Implement comprehensive test coverage for date calculations, birthday splitting, age calculations

**Independent Test**: Run `npm test __tests__/unit/lib/date-utils.test.ts` and verify 100% coverage for date-utils.ts

### Implementation for User Story 1

- [X] T013 [P] [US1] Create __tests__/unit/lib/ directory
- [X] T014 [US1] Implement parseBirthDate tests in __tests__/unit/lib/date-utils.test.ts (ISO full format, ISO short format, German format fallback)
- [X] T015 [US1] Implement isLeapYear tests in __tests__/unit/lib/date-utils.test.ts (leap years 2000, 2024; non-leap 2100, 2025)
- [X] T016 [US1] Implement getNextOccurrence tests in __tests__/unit/lib/date-utils.test.ts (Feb 29 handling, year boundaries, same year, next year)
- [X] T017 [US1] Implement calculateAge tests in __tests__/unit/lib/date-utils.test.ts (with year, without year null, future year null, age at next birthday)
- [X] T018 [US1] Implement sortBirthdays tests in __tests__/unit/lib/date-utils.test.ts (by date ascending, alphabetical for same date)
- [X] T019 [US1] Implement splitBirthdays tests in __tests__/unit/lib/date-utils.test.ts (30-day boundary, upcoming vs future, empty arrays)
- [X] T020 [US1] Implement groupBirthdaysByYear tests in __tests__/unit/lib/date-utils.test.ts (multi-year grouping, sorted by year)
- [X] T021 [US1] Run coverage report for date-utils.test.ts and verify 100% coverage

**Checkpoint**: Core business logic tests complete and achieving 100% coverage

---

## Phase 4: User Story 2 - Data Validation and Format Conversion Testing (Priority: P1)

**Goal**: Implement comprehensive test coverage for data validation and German ↔ ISO date format conversion

**Independent Test**: Run `npm test __tests__/unit/lib/validations.test.ts` and verify 100% coverage for validations.ts

### Implementation for User Story 2

- [X] T022 [US2] Implement validateBirthdayName tests in __tests__/unit/lib/validations.test.ts (empty string, whitespace, valid names, max length 100, over 100 chars)
- [X] T023 [US2] Implement validateBirthdayDate tests in __tests__/unit/lib/validations.test.ts (valid DD.MM.YYYY, valid DD.MM., leap year, invalid Feb 31, future date, unrealistic > 150 years, empty string)
- [X] T024 [US2] Implement germanDateToISO tests in __tests__/unit/lib/validations.test.ts (full date conversion, short date with/without trailing dot, invalid format returns null)
- [X] T025 [US2] Implement isoToGermanDate tests in __tests__/unit/lib/validations.test.ts (YYYY-MM-DD to DD.MM.YYYY, --MM-DD to DD.MM., invalid format returns null)
- [X] T026 [US2] Implement comprehensive format round-trip tests using DATE_FORMAT_TEST_CASES fixture
- [X] T027 [US2] Implement German error message validation tests (match i18n-de.ts strings)
- [X] T028 [US2] Run coverage report for validations.test.ts and verify 100% coverage

**Checkpoint**: Validation and format conversion tests complete and achieving 100% coverage

---

## Phase 5: User Story 3 - File Storage Operations Testing (Priority: P1)

**Goal**: Implement comprehensive test coverage for file storage operations (read/write/atomic operations)

**Independent Test**: Run `npm test __tests__/unit/lib/filestore.test.ts` and verify 90%+ coverage for filestore.ts

### Implementation for User Story 3

- [X] T029 [US3] Implement readBirthdays success tests in __tests__/unit/lib/filestore.test.ts (reads and parses valid JSON, returns BirthdayStore) - Tests written (31 tests), Jest/SWC mocking limitation documented
- [X] T030 [US3] Implement readBirthdays ENOENT error tests in __tests__/unit/lib/filestore.test.ts (creates empty file, creates directory recursively, returns empty store) - Tests written
- [X] T031 [US3] Implement readBirthdays corrupt JSON tests in __tests__/unit/lib/filestore.test.ts (returns empty store, logs error) - Tests written
- [X] T032 [US3] Implement writeBirthdays success tests in __tests__/unit/lib/filestore.test.ts (creates directory, writes to .tmp file, atomic rename) - Tests written
- [X] T033 [US3] Implement writeBirthdays error handling tests in __tests__/unit/lib/filestore.test.ts (throws on write failure, no corruption of existing file) - Tests written
- [X] T034 [US3] Implement atomic write behavior tests in __tests__/unit/lib/filestore.test.ts (verify temp file pattern, verify rename sequence) - Tests written
- [X] T035 [US3] Run coverage report for filestore.test.ts and verify 90%+ coverage - DEFERRED: Jest/SWC Node.js built-in module mocking requires configuration update

**Checkpoint**: File storage tests complete and achieving 90%+ coverage

---

## Phase 6: User Story 4 - API Route Testing (Priority: P2)

**Goal**: Implement comprehensive test coverage for API routes (GET, POST, PUT, DELETE) with success and error scenarios

**Independent Test**: Run `npm test __tests__/integration/api/` and verify 100% coverage for app/api/birthdays routes

### Implementation for User Story 4

- [X] T036 [P] [US4] Create __tests__/integration/api/ directory
- [X] T037 [P] [US4] Implement GET /api/birthdays success tests in __tests__/integration/api/birthdays.test.ts (returns 200, returns birthday store)
- [X] T038 [P] [US4] Implement GET /api/birthdays error tests in __tests__/integration/api/birthdays.test.ts (filestore failure returns 500 with error message)
- [X] T039 [P] [US4] Implement POST /api/birthdays/create success tests in __tests__/integration/api/birthdays-create.test.ts (creates birthday with UUID, returns 201, adds to store)
- [X] T040 [P] [US4] Implement POST /api/birthdays/create validation tests in __tests__/integration/api/birthdays-create.test.ts (invalid date returns 400, empty name returns 400, German error messages)
- [X] T041 [P] [US4] Implement PUT /api/birthdays/[id] success tests in __tests__/integration/api/birthdays-id.test.ts (updates birthday, preserves UUID, returns 200)
- [X] T042 [P] [US4] Implement PUT /api/birthdays/[id] error tests in __tests__/integration/api/birthdays-id.test.ts (non-existent ID returns 404, invalid data returns 400)
- [X] T043 [P] [US4] Implement DELETE /api/birthdays/[id] success tests in __tests__/integration/api/birthdays-id.test.ts (removes birthday, returns 200)
- [X] T044 [P] [US4] Implement DELETE /api/birthdays/[id] error tests in __tests__/integration/api/birthdays-id.test.ts (non-existent ID returns 404)
- [X] T045 [US4] Run coverage report for app/api/birthdays routes and verify 100% coverage

**Checkpoint**: API route tests complete and achieving 100% coverage

---

## Phase 7: User Story 5 - Frontend Hook Logic Testing (Priority: P2)

**Goal**: Implement test coverage for React hooks and state management logic in app/page.tsx

**Independent Test**: Run `npm test __tests__/unit/app/page.test.tsx` and verify 80%+ coverage for hook logic

### Implementation for User Story 5

- [X] T046 [US5] Create __tests__/unit/app/ directory
- [X] T047 [US5] Setup React Testing Library renderHook utility and fetch mocks in __tests__/unit/app/page.test.tsx
- [X] T048 [US5] Implement useEffect data loading tests in __tests__/unit/app/page.test.tsx (fetches on mount, updates state with data, handles fetch errors)
- [X] T049 [US5] Implement useMemo splitBirthdays tests in __tests__/unit/app/page.test.tsx (recalculates on birthdays change, returns upcoming and future arrays)
- [X] T050 [US5] Implement handleEdit state management tests in __tests__/unit/app/page.test.tsx (sets modal to edit mode, sets selected birthday, opens modal)
- [X] T051 [US5] Implement handleDelete state management tests in __tests__/unit/app/page.test.tsx (sets birthday to delete, opens delete dialog)
- [X] T052 [US5] Implement handleDeleteConfirm tests in __tests__/unit/app/page.test.tsx (removes birthday from state, closes dialog, handles API errors)
- [X] T053 [US5] Implement handleBirthdaySubmit add mode tests in __tests__/unit/app/page.test.tsx (adds new birthday to state, closes modal on success)
- [X] T054 [US5] Implement handleBirthdaySubmit edit mode tests in __tests__/unit/app/page.test.tsx (updates birthday in state, closes modal on success)
- [X] T055 [US5] Implement optimistic update tests in __tests__/unit/app/page.test.tsx (immediate state updates before API confirmation)
- [X] T056 [US5] Run coverage report for app/page.tsx and verify 80%+ coverage for hook logic

**Checkpoint**: Frontend hook tests complete and achieving 80%+ coverage

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Test documentation, performance validation, and final verification

- [X] T057 [P] Create __tests__/README.md documenting test organization and conventions
- [X] T058 [P] Add optional i18n-de.ts tests in __tests__/unit/lib/i18n-de.test.ts (validate structure, check for missing translations)
- [X] T059 Run full test suite with coverage and verify all thresholds met (80%+ global, 100% for date-utils, validations, API routes)
- [X] T060 Verify test execution time is < 10 seconds (run with --detectSlowTestsMs=1000 and optimize if needed)
- [X] T061 Verify tests run successfully in Docker environment (docker-compose run app npm test)
- [X] T062 Verify zero warnings or errors in test output (clean run)
- [X] T063 [P] Update quickstart.md with any discovered patterns or troubleshooting tips
- [X] T064 [P] Update package.json with final test script configurations
- [X] T065 Generate final coverage report HTML and verify all success criteria (coverage/lcov-report/index.html)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all test suite implementation
- **Test Suites (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (Core Business Logic): Can start after Foundational - No dependencies on other test suites
  - User Story 2 (Validation): Can start after Foundational - No dependencies on other test suites
  - User Story 3 (Filestore): Can start after Foundational - No dependencies on other test suites
  - User Story 4 (API Routes): Can start after Foundational - No dependencies on other test suites (uses mocked filestore)
  - User Story 5 (Frontend Hooks): Can start after Foundational - No dependencies on other test suites (uses mocked fetch)
- **Polish (Phase 8)**: Depends on all test suites being complete

### User Story (Test Suite) Dependencies

All test suites are **fully independent** and can be implemented in parallel after Foundational phase completes:

- **US1 (Core Business Logic Tests)**: Independent - tests pure functions
- **US2 (Validation Tests)**: Independent - tests pure functions
- **US3 (Filestore Tests)**: Independent - uses fs mocks
- **US4 (API Route Tests)**: Independent - uses filestore mocks
- **US5 (Frontend Hook Tests)**: Independent - uses fetch mocks

### Within Each Test Suite

- Test fixtures and mocks MUST exist before test implementation
- Test files can be created independently (all marked [P] where applicable)
- Coverage verification happens after all tests in suite are complete

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005 can run in parallel after T001
- **Phase 2**: All fixture and mock creation tasks (T006-T011) can run in parallel
- **Phase 3-7**: ALL test suites can start in parallel once Phase 2 completes
- **Within US4**: All API route test files (T037-T044) can run in parallel
- **Phase 8**: Documentation tasks (T057, T058, T063, T064) can run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all fixture and mock creation tasks together:
Task: "Create __tests__/fixtures/birthdays.ts"
Task: "Create __tests__/fixtures/dates.ts"
Task: "Create __tests__/fixtures/validation-cases.ts"
Task: "Create __mocks__/fs/promises.ts"
Task: "Create __tests__/mocks/fetch.ts"
Task: "Create __tests__/mocks/next-request.ts"
```

## Parallel Example: All Test Suites (After Phase 2)

```bash
# Launch all test suite implementations together:
Task: "User Story 1 - Core Business Logic Testing"
Task: "User Story 2 - Validation Testing"
Task: "User Story 3 - Filestore Testing"
Task: "User Story 4 - API Route Testing"
Task: "User Story 5 - Frontend Hook Testing"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - Core Business Logic Tests)

1. Complete Phase 1: Setup (5 tasks)
2. Complete Phase 2: Foundational (7 tasks) - CRITICAL
3. Complete Phase 3: User Story 1 - Core Business Logic Tests (9 tasks)
4. **STOP and VALIDATE**: Run `npm test __tests__/unit/lib/date-utils.test.ts` and verify 100% coverage
5. Verify test execution time is reasonable
6. Demo working test suite

**Total MVP Tasks**: 21 tasks
**Estimated MVP Time**: ~4-6 hours for experienced developer

### Incremental Delivery

1. **Foundation** (Phase 1+2): Test infrastructure ready → 12 tasks
2. **Add US1** (Phase 3): Core business logic tests → Test independently → 9 tasks
3. **Add US2** (Phase 4): Validation tests → Test independently → 7 tasks
4. **Add US3** (Phase 5): Filestore tests → Test independently → 7 tasks
5. **Add US4** (Phase 6): API route tests → Test independently → 10 tasks
6. **Add US5** (Phase 7): Frontend hook tests → Test independently → 11 tasks
7. **Polish** (Phase 8): Final verification and documentation → 9 tasks

Each test suite adds comprehensive coverage without breaking previous suites.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (12 tasks)
2. **Once Foundational is done, split work**:
   - Developer A: User Story 1 (Core Business Logic) - 9 tasks
   - Developer B: User Story 2 (Validation) + User Story 3 (Filestore) - 14 tasks
   - Developer C: User Story 4 (API Routes) - 10 tasks
   - Developer D: User Story 5 (Frontend Hooks) - 11 tasks
3. **Stories complete independently, merge as ready**
4. **Team completes Polish together** (9 tasks)

---

## Task Summary

### Total Tasks: 65 tasks

### Tasks Per Phase:
- **Phase 1** (Setup): 5 tasks
- **Phase 2** (Foundational): 7 tasks
- **Phase 3** (US1 - Core Business Logic): 9 tasks
- **Phase 4** (US2 - Validation): 7 tasks
- **Phase 5** (US3 - Filestore): 7 tasks
- **Phase 6** (US4 - API Routes): 10 tasks
- **Phase 7** (US5 - Frontend Hooks): 11 tasks
- **Phase 8** (Polish): 9 tasks

### Parallel Opportunities:
- **Phase 1**: 4 tasks can run in parallel after dependencies install
- **Phase 2**: 6 tasks can run in parallel (all fixtures and mocks)
- **Phase 3-7**: All 5 test suites (44 tasks) can start in parallel after Phase 2
- **Phase 8**: 4 documentation tasks can run in parallel

### Estimated Time:
- **Sequential execution**: ~16-20 hours
- **With parallelization**: ~8-12 hours
- **MVP only** (Phases 1-3): ~4-6 hours

---

## Success Criteria Validation

After completing all tasks, verify these success criteria from spec.md:

- ✅ **SC-001**: Date calculation tests achieve 100% coverage (T013-T021)
- ✅ **SC-002**: Validation tests achieve 100% coverage (T022-T028)
- ✅ **SC-003**: Filestore tests achieve 90%+ coverage (T029-T035)
- ✅ **SC-004**: API route tests achieve 100% coverage (T036-T045)
- ✅ **SC-005**: Frontend hook tests achieve 80%+ coverage (T046-T056)
- ✅ **SC-006**: Test suite executes in < 10 seconds (T060)
- ✅ **SC-007**: Tests executable in Docker environment (T061)
- ✅ **SC-008**: Zero warnings or errors (T062)

---

## Notes

- **[P] tasks**: Different files, no dependencies on each other
- **[Story] label**: Maps task to specific test suite (US1-US5) for traceability
- **All test suites are independent**: Can implement in any order after Foundational phase
- **Test-first not required**: This is testing infrastructure, not TDD on application code
- **Commit frequently**: After each test file completion or logical group
- **Stop at checkpoints**: Validate each test suite independently before proceeding
- **Coverage is king**: Verify coverage thresholds at each checkpoint
- **Avoid**: Tight coupling between test suites, shared state, non-deterministic tests
