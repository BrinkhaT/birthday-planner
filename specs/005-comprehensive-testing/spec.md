# Feature Specification: Comprehensive Testing for Non-Visual Logic

**Feature Branch**: `005-comprehensive-testing`
**Created**: 2025-10-30
**Status**: Draft
**Input**: User description: "setze ein umfassendes Testing für alle nicht-visuellen Bereiche auf. Inkludiere aber die Hooks und so im Frontend (also logiken)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Business Logic Testing (Priority: P1)

As a **software developer**, I want comprehensive test coverage for core business logic (date calculations, birthday splitting, age calculations) so that I can confidently refactor code without breaking birthday features.

**Why this priority**: Core business logic is the foundation of the application. Errors in date calculations or birthday splitting would directly impact user experience and data correctness.

**Independent Test**: Can be fully tested by running unit tests for date-utils functions and validates that all birthday-related calculations work correctly with various edge cases (leap years, Feb 29, year boundaries).

**Acceptance Scenarios**:

1. **Given** a birthday on Feb 29, 2000, **When** calculating next occurrence in a non-leap year, **Then** the system should return Feb 28 of the current non-leap year
2. **Given** a birthday with full date (DD.MM.YYYY), **When** calculating age, **Then** the system should return correct age at next birthday
3. **Given** a birthday without year (DD.MM.), **When** calculating age, **Then** the system should return null
4. **Given** multiple birthdays, **When** splitting by date range (30 days), **Then** upcoming array contains only birthdays within 30 days from reference date
5. **Given** birthdays occurring on same date, **When** sorting, **Then** birthdays should be sorted alphabetically by name as secondary criteria

---

### User Story 2 - Data Validation and Format Conversion Testing (Priority: P1)

As a **software developer**, I want comprehensive test coverage for data validation and format conversion (German ↔ ISO date formats, name validation) so that the application always stores valid data and prevents corrupt entries.

**Why this priority**: Data validation is critical for data integrity. Invalid dates or names could corrupt the JSON storage or cause application errors.

**Independent Test**: Can be fully tested by running unit tests for validations.ts functions and validates that all German date formats are correctly converted to ISO and vice versa, including edge cases.

**Acceptance Scenarios**:

1. **Given** a German date "31.12.2000", **When** converting to ISO format, **Then** the system should return "2000-12-31"
2. **Given** a German date "25.12." (without year), **When** converting to ISO format, **Then** the system should return "--12-25"
3. **Given** an ISO date "--06-15", **When** converting to German format, **Then** the system should return "15.06."
4. **Given** an invalid date "31.02.2000", **When** validating, **Then** the system should return error message "Ungültiges Datum"
5. **Given** a name with 101 characters, **When** validating, **Then** the system should return error message about maximum length
6. **Given** a future date, **When** validating, **Then** the system should return error message "Geburtsdatum kann nicht in der Zukunft liegen"

---

### User Story 3 - File Storage Operations Testing (Priority: P1)

As a **software developer**, I want comprehensive test coverage for file storage operations (read/write/atomic operations) so that birthday data is never lost or corrupted during save operations.

**Why this priority**: Data persistence is critical. Loss or corruption of birthday data would be catastrophic for users. Atomic operations ensure data consistency even during failures.

**Independent Test**: Can be fully tested by running unit tests for filestore.ts functions with mocked file system operations, validates atomic write behavior and error handling.

**Acceptance Scenarios**:

1. **Given** a non-existent data file, **When** reading birthdays, **Then** the system should create an empty file with version 1.0.0 and empty birthdays array
2. **Given** a corrupted JSON file, **When** reading birthdays, **Then** the system should return empty store and log error
3. **Given** valid birthday data, **When** writing to storage, **Then** the system should use atomic rename to ensure consistency
4. **Given** a write failure, **When** attempting to save data, **Then** the system should throw error without corrupting existing file
5. **Given** missing data directory, **When** writing birthdays, **Then** the system should create directory recursively before writing

---

### User Story 4 - API Route Testing (Priority: P2)

As a **software developer**, I want comprehensive test coverage for API routes (GET, POST, PUT, DELETE) so that all API endpoints handle requests and errors correctly.

**Why this priority**: API routes are the interface between frontend and backend. Proper error handling and data validation at this layer prevents invalid data from reaching storage.

**Independent Test**: Can be fully tested by running integration tests for Next.js API routes with mocked filestore functions, validates request/response handling and error cases.

**Acceptance Scenarios**:

1. **Given** a GET request to /api/birthdays, **When** data loads successfully, **Then** the system should return 200 with birthday store
2. **Given** a GET request to /api/birthdays, **When** storage read fails, **Then** the system should return 500 with error message
3. **Given** a POST request to /api/birthdays/create with valid data, **When** processing request, **Then** the system should create birthday with UUID and return 201
4. **Given** a POST request with invalid date format, **When** validating request, **Then** the system should return 400 with validation error
5. **Given** a PUT request to /api/birthdays/[id] with valid data, **When** updating birthday, **Then** the system should preserve UUID and return 200
6. **Given** a DELETE request to /api/birthdays/[id] for non-existent ID, **When** processing request, **Then** the system should return 404
7. **Given** a DELETE request to /api/birthdays/[id] for existing birthday, **When** processing request, **Then** the system should remove birthday and return 200

---

### User Story 5 - Frontend Hook Logic Testing (Priority: P2)

As a **software developer**, I want test coverage for custom React hooks and state management logic so that frontend state updates work correctly without manual testing.

**Why this priority**: Frontend logic errors can cause inconsistent UI state or failed operations. Testing hooks ensures state management works correctly in isolation.

**Independent Test**: Can be fully tested using React Testing Library's renderHook utility, validates useState, useEffect, and useMemo logic without rendering full components.

**Acceptance Scenarios**:

1. **Given** birthdays data loaded via useEffect, **When** component mounts, **Then** fetch should be called once and state updated with data
2. **Given** birthdays array in state, **When** useMemo recalculates split birthdays, **Then** upcoming and future arrays should be correctly computed
3. **Given** an edit operation, **When** handleEdit is called, **Then** modal state should be set to 'edit' mode with selected birthday
4. **Given** a delete operation, **When** handleDeleteConfirm completes, **Then** birthday should be removed from state and dialog closed
5. **Given** optimistic update during add operation, **When** API call succeeds, **Then** new birthday should be added to state immediately

---

### Edge Cases

- **Leap year boundary**: Feb 29 birthdays in leap and non-leap years
- **Year boundaries**: Birthdays on Dec 31/Jan 1 spanning year transitions
- **Missing data file**: First-time application startup with no existing data
- **Corrupted JSON**: Invalid JSON format in storage file
- **Concurrent writes**: Multiple write operations happening simultaneously (atomic rename prevents corruption)
- **Invalid date formats**: Dates like 31.02, 32.01, or 00.13
- **Unrealistic dates**: Birthdays over 150 years ago
- **Future dates**: Birthdays in the future (validation should reject)
- **Empty strings**: Empty name or date fields
- **Very long names**: Names exceeding 100 characters
- **API errors**: Network failures, 500 errors from backend
- **Missing data directory**: Directory deleted while application running

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide unit tests for all pure functions in date-utils.ts covering date parsing, leap year detection, next occurrence calculation, age calculation, birthday sorting, and splitting logic
- **FR-002**: System MUST provide unit tests for all validation functions in validations.ts covering name validation, date validation, and bidirectional format conversion (German ↔ ISO)
- **FR-003**: System MUST provide unit tests for all filestore operations in filestore.ts covering read operations, write operations, atomic rename behavior, directory creation, and error handling
- **FR-004**: System MUST provide integration tests for all API routes covering GET /api/birthdays, POST /api/birthdays/create, PUT /api/birthdays/[id], and DELETE /api/birthdays/[id] with success and error scenarios
- **FR-005**: System MUST provide tests for frontend hook logic in app/page.tsx covering useEffect data loading, useMemo computations, and event handler state management
- **FR-006**: All tests MUST use industry-standard testing frameworks suitable for Next.js/React applications
- **FR-007**: Tests MUST be executable via npm scripts (e.g., npm test, npm run test:unit, npm run test:integration)
- **FR-008**: Tests MUST include comprehensive edge case coverage as documented in Edge Cases section
- **FR-009**: System MUST provide clear test organization separating unit tests, integration tests, and hook tests into logical directories
- **FR-010**: Tests MUST validate error messages are in German language where applicable (matching i18n-de.ts strings)
- **FR-011**: System MUST achieve minimum 80% code coverage for all non-visual modules (lib/*.ts files)
- **FR-012**: Tests MUST use mocking appropriately to isolate units under test (e.g., mock file system for filestore tests, mock fetch for API tests)
- **FR-013**: System MUST provide test documentation explaining how to run tests and interpret results

### Key Entities

- **Test Suite**: Collection of related test cases organized by module (date-utils, validations, filestore, API routes, hooks)
- **Test Case**: Individual test validating specific behavior with given/when/then structure
- **Mock**: Test double replacing real dependencies (file system, HTTP fetch, etc.)
- **Test Coverage Report**: Report showing percentage of code covered by tests

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All date calculation functions achieve 100% test coverage including edge cases (leap years, year boundaries, Feb 29)
- **SC-002**: All validation functions achieve 100% test coverage including all error conditions
- **SC-003**: File storage operations achieve 90%+ test coverage including error handling paths
- **SC-004**: All API routes achieve 100% test coverage for both success and error responses
- **SC-005**: Frontend hook logic achieves 80%+ test coverage for state management operations
- **SC-006**: Test suite executes in under 10 seconds for rapid development feedback
- **SC-007**: Tests can be executed in Docker environment to match production configuration
- **SC-008**: Zero warnings or errors during test execution (only passes or explicit failures)

## Assumptions *(optional)*

- Testing framework will be Jest (industry standard for Next.js/React)
- React Testing Library will be used for hook testing
- API routes will be tested using Next.js testing utilities or supertest
- File system operations will be mocked using jest.mock()
- Tests will not require running development server (isolated unit/integration tests)
- Test coverage reports will be generated using Jest's built-in coverage tool
- CI/CD integration can be added later (tests designed to run locally first)
- Visual/UI testing (component rendering, styling) is explicitly out of scope
- E2E tests with browser automation (Playwright/Cypress) are out of scope for this feature

## Dependencies *(optional)*

- Requires installation of testing dependencies: jest, @testing-library/react, @testing-library/react-hooks, @types/jest
- Requires Next.js testing configuration (jest.config.js, jest.setup.js)
- Depends on existing TypeScript types in types/birthday.ts
- Depends on existing utility functions remaining stable during test implementation

## Non-Functional Requirements *(optional)*

- **Performance**: Test suite must execute in under 10 seconds
- **Maintainability**: Tests must be clearly documented with descriptive test names
- **Reliability**: Tests must be deterministic (no flaky tests due to timing or randomness)
- **Portability**: Tests must run on macOS, Linux, and Windows without modification
- **Debuggability**: Failed tests must provide clear error messages indicating what went wrong

## Constraints *(optional)*

- Visual components (BirthdayCard, BirthdayTable, etc.) are explicitly excluded from this feature
- No changes to existing application code beyond adding test files and configuration
- Tests must not require external services or databases (fully isolated)
- Test execution must not write to production data directory (/data)
