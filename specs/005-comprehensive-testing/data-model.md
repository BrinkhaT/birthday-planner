# Data Model: Test Data Structures and Fixtures

**Feature**: 005-comprehensive-testing
**Date**: 2025-10-30
**Phase**: 1 (Design & Contracts)

## Overview

This document defines the test data structures, fixtures, and mock data used across the test suite for the Birthday Planner application.

## Test Fixture Entities

### 1. Birthday Test Fixtures

**Purpose**: Standard test data for birthday-related tests

```typescript
// Fixture: Complete birthday with year
export const BIRTHDAY_WITH_YEAR = {
  id: 'test-id-001',
  name: 'Paula Müller',
  birthDate: '2000-12-25', // ISO format internally
};

// Fixture: Birthday without year
export const BIRTHDAY_WITHOUT_YEAR = {
  id: 'test-id-002',
  name: 'Thomas Schmidt',
  birthDate: '--06-15', // ISO recurring date format
};

// Fixture: Leap year birthday (Feb 29)
export const BIRTHDAY_LEAP_YEAR = {
  id: 'test-id-003',
  name: 'Lea Wagner',
  birthDate: '2000-02-29',
};

// Fixture: Birthday in the past (for upcoming tests)
export const BIRTHDAY_PAST = {
  id: 'test-id-004',
  name: 'Anna Becker',
  birthDate: '1995-01-10',
};

// Fixture: Birthday in the future (for upcoming tests)
export const BIRTHDAY_FUTURE = {
  id: 'test-id-005',
  name: 'Max Fischer',
  birthDate: '1990-11-20',
};
```

**Usage**:
- Import in test files: `import { BIRTHDAY_WITH_YEAR } from '@/test-fixtures/birthdays'`
- Deep clone for mutation tests: `const birthday = structuredClone(BIRTHDAY_WITH_YEAR)`

### 2. BirthdayStore Test Fixtures

**Purpose**: Complete store objects for filestore tests

```typescript
// Fixture: Empty store (new installation)
export const EMPTY_STORE = {
  version: '1.0.0',
  birthdays: [],
};

// Fixture: Store with multiple birthdays
export const POPULATED_STORE = {
  version: '1.0.0',
  birthdays: [
    BIRTHDAY_WITH_YEAR,
    BIRTHDAY_WITHOUT_YEAR,
    BIRTHDAY_LEAP_YEAR,
  ],
};

// Fixture: Invalid store (for error handling tests)
export const INVALID_STORE_MISSING_VERSION = {
  birthdays: [BIRTHDAY_WITH_YEAR],
  // Missing 'version' field
};

export const INVALID_STORE_WRONG_TYPE = {
  version: '1.0.0',
  birthdays: 'not-an-array', // Wrong type
};
```

### 3. Reference Dates for Deterministic Tests

**Purpose**: Fixed dates for consistent test results

```typescript
// Reference: Leap year (2024)
export const REF_DATE_LEAP_YEAR = new Date('2024-02-28');

// Reference: Non-leap year (2025)
export const REF_DATE_NON_LEAP = new Date('2025-02-28');

// Reference: Year boundary (end of year)
export const REF_DATE_YEAR_END = new Date('2025-12-31');

// Reference: Year boundary (start of year)
export const REF_DATE_YEAR_START = new Date('2025-01-01');

// Reference: Middle of year (for general tests)
export const REF_DATE_MID_YEAR = new Date('2025-06-15');
```

**Usage**:
- Always use reference dates for date calculations
- Never use `new Date()` without mocking in tests
- Ensures reproducibility across time zones and execution times

### 4. German Date Format Test Cases

**Purpose**: Comprehensive format conversion test data

```typescript
export const DATE_FORMAT_TEST_CASES = [
  // Valid formats
  { german: '25.12.2000', iso: '2000-12-25', description: 'Full date with year' },
  { german: '15.06.', iso: '--06-15', description: 'Date without year (with trailing dot)' },
  { german: '15.06', iso: '--06-15', description: 'Date without year (without trailing dot)' },
  { german: '01.01.1900', iso: '1900-01-01', description: 'Historical date' },
  { german: '29.02.2000', iso: '2000-02-29', description: 'Leap year date' },

  // Invalid formats
  { german: '31.02.2000', iso: null, error: 'Ungültiges Datum', description: 'Invalid day for month' },
  { german: '32.01.2000', iso: null, error: 'Ungültiges Datum', description: 'Day out of range' },
  { german: '15.13.2000', iso: null, error: 'Ungültiges Datum', description: 'Month out of range' },
  { german: '00.01.2000', iso: null, error: 'Ungültiges Datum', description: 'Zero day' },
  { german: '15.00.2000', iso: null, error: 'Ungültiges Datum', description: 'Zero month' },
  { german: '', iso: null, error: 'Geburtsdatum ist erforderlich', description: 'Empty string' },
  { german: 'invalid', iso: null, error: 'Ungültiges Datum (Format: TT.MM. oder TT.MM.JJJJ)', description: 'Non-date string' },
];
```

### 5. Validation Test Cases

**Purpose**: Comprehensive validation scenarios

```typescript
export const NAME_VALIDATION_CASES = [
  { input: 'Paula', expected: null, description: 'Valid short name' },
  { input: 'Anna-Maria Müller', expected: null, description: 'Valid name with hyphen and umlaut' },
  { input: 'José García', expected: null, description: 'Valid name with accents' },
  { input: 'X', expected: null, description: 'Valid single character' },
  { input: 'A'.repeat(100), expected: null, description: 'Valid 100 characters (boundary)' },
  { input: '', expected: 'Name ist erforderlich', description: 'Empty string' },
  { input: '   ', expected: 'Name ist erforderlich', description: 'Whitespace only' },
  { input: 'A'.repeat(101), expected: 'Name darf maximal 100 Zeichen lang sein', description: 'Exceeds 100 characters' },
];

export const DATE_VALIDATION_CASES = [
  { input: '25.12.2000', expected: null, description: 'Valid full date' },
  { input: '15.06.', expected: null, description: 'Valid date without year' },
  { input: '29.02.2000', expected: null, description: 'Valid leap year date' },
  { input: '31.02.2000', expected: 'Ungültiges Datum', description: 'Invalid day for February' },
  { input: '01.01.3000', expected: 'Geburtsdatum kann nicht in der Zukunft liegen', description: 'Future date' },
  { input: '01.01.1800', expected: 'Geburtsdatum ist unrealistisch', description: 'Unrealistic past date (>150 years)' },
  { input: '', expected: 'Geburtsdatum ist erforderlich', description: 'Empty string' },
];
```

## Mock Data Structures

### 1. File System Mocks

**Purpose**: Mock fs/promises module for filestore tests

```typescript
// __mocks__/fs/promises.ts
export const readFile = jest.fn();
export const writeFile = jest.fn();
export const rename = jest.fn();
export const mkdir = jest.fn();

// Mock ENOENT error (file not found)
export const mockENOENTError = () => {
  const error: any = new Error('ENOENT: no such file or directory');
  error.code = 'ENOENT';
  return error;
};

// Mock permission error
export const mockEPERMError = () => {
  const error: any = new Error('EPERM: operation not permitted');
  error.code = 'EPERM';
  return error;
};
```

### 2. Fetch API Mocks

**Purpose**: Mock global fetch for React hook tests

```typescript
// Test utility: mockFetch
export const mockFetchSuccess = (data: any) => {
  return jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  } as Response);
};

export const mockFetchError = (status: number, error: string) => {
  return jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error }),
  } as Response);
};

export const mockFetchNetworkError = () => {
  return jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
};
```

### 3. Next.js Request/Response Mocks

**Purpose**: Mock Next.js Request and Response for API route tests

```typescript
// Test utility: createMockRequest
export const createMockRequest = (method: string, body?: any): NextRequest => {
  return new NextRequest('http://localhost:3000/api/test', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

// Test utility: parseResponse
export const parseResponse = async (response: Response) => {
  return {
    status: response.status,
    body: await response.json(),
  };
};
```

## Test Data Organization

### File Structure

```
__tests__/
├── fixtures/
│   ├── birthdays.ts          # Birthday test fixtures
│   ├── dates.ts              # Reference dates
│   └── validation-cases.ts   # Validation test cases
└── mocks/
    ├── fetch.ts              # Fetch API mocks
    ├── next-request.ts       # Next.js request mocks
    └── filestore.ts          # Filestore mocks

__mocks__/
└── fs/
    └── promises.ts           # fs/promises module mock
```

### Usage Guidelines

1. **Import Fixtures**: Use named imports for clarity
   ```typescript
   import { BIRTHDAY_WITH_YEAR, REF_DATE_MID_YEAR } from '@/test-fixtures';
   ```

2. **Clone Before Mutation**: Always clone fixtures before modifying
   ```typescript
   const birthday = structuredClone(BIRTHDAY_WITH_YEAR);
   birthday.name = 'Modified';
   ```

3. **Use Reference Dates**: Never use `new Date()` directly in tests
   ```typescript
   // Good
   const result = calculateAge(birthday, REF_DATE_MID_YEAR);

   // Bad
   const result = calculateAge(birthday, new Date());
   ```

4. **Parameterized Tests**: Use test case arrays for comprehensive coverage
   ```typescript
   describe.each(DATE_FORMAT_TEST_CASES)('$description', ({ german, iso, error }) => {
     it('converts correctly', () => {
       // ...
     });
   });
   ```

## Entity Relationships in Tests

```
Test Suite
├── Unit Tests
│   ├── date-utils.test.ts → uses BIRTHDAY fixtures + REF_DATE fixtures
│   ├── validations.test.ts → uses VALIDATION_CASES
│   └── filestore.test.ts → uses STORE fixtures + fs mocks
├── Integration Tests
│   └── api/birthdays.test.ts → uses BIRTHDAY fixtures + Next.js mocks
└── Hook Tests
    └── app/page.test.tsx → uses BIRTHDAY fixtures + fetch mocks
```

## Data Consistency Rules

1. **ID Format**: Use `test-id-XXX` pattern for all test IDs
2. **Dates**: All internal dates use ISO format (YYYY-MM-DD or --MM-DD)
3. **German Display**: Test display functions convert to DD.MM.YYYY or DD.MM.
4. **Version**: All store fixtures use version "1.0.0"
5. **Names**: Use German names (Müller, Schmidt, Wagner, etc.)

## Performance Considerations

- **Fixture Reuse**: Define fixtures once, import across tests
- **Deep Clone**: Use `structuredClone()` for object copying (faster than JSON parse/stringify)
- **Mock Caching**: Jest caches mocks automatically across test files
- **Minimal Data**: Keep fixtures small (1-5 birthdays max)

## Summary

This data model provides:
- **Comprehensive fixtures** for all test scenarios
- **Reusable test cases** for parameterized tests
- **Standardized mocks** for external dependencies
- **Clear organization** for maintainability
- **Type safety** via TypeScript

All tests should use these fixtures and mocks to ensure consistency and maintainability across the test suite.
