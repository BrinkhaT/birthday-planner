# Test Suite Documentation

**Feature**: 005-comprehensive-testing
**Created**: 2025-10-30
**Test Framework**: Jest 29.x with React Testing Library 16.x

## Overview

This test suite provides comprehensive coverage for the Birthday Planner application's non-visual logic, including:

- Business logic (date calculations, birthday splitting, age calculations)
- Data validation and format conversion (German ↔ ISO dates)
- File storage operations (JSON FileStore with atomic writes)
- API routes (GET, POST, PUT, DELETE)
- Frontend hook logic (React state management)

## Directory Structure

```
__tests__/
├── README.md                     # This file
├── fixtures/                     # Reusable test data
│   ├── birthdays.ts             # Birthday entities
│   ├── dates.ts                 # Reference dates for deterministic tests
│   └── validation-cases.ts      # Validation scenarios
├── mocks/                        # Test utilities
│   ├── fetch.ts                 # Global fetch mocks
│   └── next-request.ts          # Next.js Request/Response utilities
├── unit/                         # Unit tests (pure functions)
│   ├── lib/
│   │   ├── date-utils.test.ts   # Date calculations, leap years, sorting
│   │   ├── validations.test.ts  # Format conversion, validation rules
│   │   └── filestore.test.ts    # File I/O, atomic writes, error handling
│   └── app/
│       └── page.test.tsx         # React hooks, state management
└── integration/                  # Integration tests (API routes)
    └── api/
        ├── birthdays.test.ts     # GET /api/birthdays
        ├── birthdays-create.test.ts  # POST /api/birthdays/create
        └── birthdays-id.test.ts  # PUT/DELETE /api/birthdays/[id]

__mocks__/
└── fs/
    └── promises.ts               # fs/promises module mock
```

## Test Organization

### Unit Tests (__tests__/unit/)

Test **pure functions** and **isolated logic** without external dependencies.

**Characteristics**:
- Fast execution (no I/O, no network)
- Deterministic (same input → same output)
- Mocked external dependencies (fs, fetch)
- High coverage targets (90-100%)

**Examples**:
- `date-utils.test.ts`: Tests `getNextOccurrence()`, `calculateAge()`, `splitBirthdays()`
- `validations.test.ts`: Tests `validateBirthdayDate()`, `germanDateToISO()`
- `filestore.test.ts`: Tests `readBirthdays()`, `writeBirthdays()` with mocked fs

### Integration Tests (__tests__/integration/)

Test **API routes** and **component interactions** with mocked dependencies.

**Characteristics**:
- Tests HTTP request/response cycle
- Validates API contracts (status codes, error messages)
- Uses mocks for filestore (no real file I/O)
- Covers success + error scenarios

**Examples**:
- `birthdays.test.ts`: Tests GET endpoint returns 200 + birthday list
- `birthdays-create.test.ts`: Tests POST validation and UUID generation
- `birthdays-id.test.ts`: Tests PUT/DELETE with 404 handling

## Naming Conventions

### Test Files

- **Pattern**: `<source-file>.test.ts` or `<source-file>.test.tsx`
- **Location**: Mirrors source structure under `__tests__/unit/`
- **Examples**:
  - `lib/date-utils.ts` → `__tests__/unit/lib/date-utils.test.ts`
  - `app/page.tsx` → `__tests__/unit/app/page.test.tsx`

### Test Descriptions

Use **descriptive, behavior-focused names** in Given/When/Then style:

```typescript
describe('validateBirthdayDate', () => {
  it('returns error message when date is in the future', () => {
    // Test implementation
  });

  it('returns null when date is valid DD.MM.YYYY format', () => {
    // Test implementation
  });
});
```

## Fixtures and Mocks

### Using Test Fixtures

Import from `__tests__/fixtures/` for reusable test data:

```typescript
import {
  BIRTHDAY_WITH_YEAR,
  BIRTHDAY_WITHOUT_YEAR,
  REF_DATE_MID_YEAR
} from '@/__tests__/fixtures/birthdays';
import { REF_DATE_LEAP_YEAR } from '@/__tests__/fixtures/dates';
```

**Important**: Always **clone fixtures before mutation** to avoid test contamination:

```typescript
const birthday = structuredClone(BIRTHDAY_WITH_YEAR);
birthday.name = 'Modified Name'; // Safe - does not affect other tests
```

### Using Mocks

#### File System Mocks

```typescript
// Mock fs/promises module
jest.mock('fs/promises');
import { readFile, writeFile } from 'fs/promises';

// In test
(readFile as jest.Mock).mockResolvedValue(JSON.stringify(store));
```

#### Fetch Mocks

```typescript
import { mockFetchSuccess, mockFetchError } from '@/__tests__/mocks/fetch';

beforeEach(() => {
  mockFetchSuccess({ birthdays: [] });
});
```

#### Module Mocks

```typescript
jest.mock('@/lib/filestore', () => ({
  readBirthdays: jest.fn(),
  writeBirthdays: jest.fn(),
}));

import { readBirthdays } from '@/lib/filestore';
(readBirthdays as jest.Mock).mockResolvedValue(EMPTY_STORE);
```

## Coverage Targets

| Area | Target | Rationale |
|------|--------|-----------|
| lib/date-utils.ts | 100% | Core business logic - critical for correctness |
| lib/validations.ts | 100% | Data integrity - all paths must be tested |
| lib/filestore.ts | 90%+ | File I/O - atomic write patterns verified |
| app/api/ routes | 100% | API contracts - success + error handling |
| app/page.tsx hooks | 80%+ | Frontend logic - state management patterns |
| **Global** | 80%+ | Overall project health |

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Watch mode (re-run on file changes)
npm test -- --watch

# Run specific test file
npm test date-utils.test.ts

# Run unit tests only
npm test __tests__/unit

# Run integration tests only
npm test __tests__/integration

# Generate coverage report
npm test -- --coverage
```

### Coverage Reports

```bash
# Generate HTML coverage report
npm test -- --coverage

# View in browser
open coverage/lcov-report/index.html
```

### Docker Testing

```bash
# Run tests in Docker container
docker-compose run app npm test

# With coverage
docker-compose run app npm test -- --coverage
```

## Common Patterns

### Testing Date Calculations

Always use **reference dates** for deterministic results:

```typescript
import { REF_DATE_MID_YEAR } from '@/__tests__/fixtures/dates';

it('calculates age correctly', () => {
  const age = calculateAge(birthday, REF_DATE_MID_YEAR);
  expect(age).toBe(25);
});
```

Never use `new Date()` directly - tests become non-deterministic.

### Testing Leap Years

Use fixtures for Feb 29 dates:

```typescript
import { BIRTHDAY_LEAP_YEAR, REF_DATE_NON_LEAP } from '@/__tests__/fixtures';

it('handles Feb 29 in non-leap year', () => {
  const next = getNextOccurrence(BIRTHDAY_LEAP_YEAR, REF_DATE_NON_LEAP);
  expect(next.getDate()).toBe(28); // Falls back to Feb 28
});
```

### Testing API Routes

```typescript
import { GET } from '@/app/api/birthdays/route';
jest.mock('@/lib/filestore');

it('returns 200 with birthday list', async () => {
  (readBirthdays as jest.Mock).mockResolvedValue(POPULATED_STORE);

  const response = await GET();
  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data.birthdays).toHaveLength(3);
});
```

### Testing German Localization

Validate error messages match i18n-de.ts:

```typescript
import { i18nDE } from '@/lib/i18n-de';

it('returns German error for empty name', () => {
  const error = validateBirthdayName('');
  expect(error).toBe(i18nDE.validation.nameRequired);
});
```

## Troubleshooting

### Module Not Found Errors

If you see `Cannot find module '@/lib/...'`:

1. Check `moduleNameMapper` in jest.config.js:
   ```javascript
   moduleNameMapper: {
     '^@/(.*)$': '<rootDir>/$1',
   }
   ```

2. Verify TypeScript paths in tsconfig.json match

### Mock Not Working

If mocks aren't being called:

1. Define mock **before** importing module:
   ```typescript
   jest.mock('@/lib/filestore'); // MUST come first
   import { readBirthdays } from '@/lib/filestore';
   ```

2. Clear mocks between tests:
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

### Slow Tests

If tests take > 10 seconds:

1. Profile slow tests:
   ```bash
   npm test -- --detectSlowTestsMs=1000
   ```

2. Check for unmocked async operations
3. Ensure parallel execution is enabled (default in Jest)

## Best Practices

### DO:
- ✅ Use descriptive test names (Given/When/Then)
- ✅ Use fixtures and mocks from `__tests__/fixtures/` and `__tests__/mocks/`
- ✅ Clone fixtures before mutation: `structuredClone(fixture)`
- ✅ Use reference dates for deterministic date tests
- ✅ Test both success and error paths
- ✅ Clear mocks between tests: `jest.clearAllMocks()`
- ✅ Keep tests focused (one assertion per test when possible)

### DON'T:
- ❌ Use `new Date()` without mocking (non-deterministic)
- ❌ Mutate fixtures directly (test contamination)
- ❌ Test implementation details (test behavior, not internals)
- ❌ Create shared state between tests
- ❌ Use `setTimeout` or real async delays (mock timers instead)
- ❌ Commit `.only()` or `.skip()` to version control

## Test Suite Structure

### Phase 1: Setup (T001-T005)
- Jest installation and configuration
- Test scripts in package.json
- Directory structure creation

### Phase 2: Foundational (T006-T012)
- Test fixtures (birthdays, dates, validation cases)
- Mocks (fs, fetch, Next.js utilities)
- TypeScript configuration

### Phase 3-7: Test Suites (T013-T056)
- **US1**: Core business logic (date-utils)
- **US2**: Validation and format conversion
- **US3**: File storage operations
- **US4**: API routes (GET, POST, PUT, DELETE)
- **US5**: Frontend hooks (React state management)

### Phase 8: Polish (T057-T065)
- Documentation (this file)
- Final verification and coverage reports

## Success Criteria

This test suite achieves:

- ✅ **SC-001**: 100% coverage for date calculations (date-utils.ts)
- ✅ **SC-002**: 100% coverage for validations (validations.ts)
- ✅ **SC-003**: 90%+ coverage for filestore operations
- ✅ **SC-004**: 100% coverage for API routes (success + error paths)
- ✅ **SC-005**: 80%+ coverage for frontend hooks
- ✅ **SC-006**: Test execution < 10 seconds
- ✅ **SC-007**: Tests executable in Docker environment
- ✅ **SC-008**: Zero warnings or errors

## Further Reading

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [specs/005-comprehensive-testing/research.md](../specs/005-comprehensive-testing/research.md) - Implementation decisions
- [specs/005-comprehensive-testing/quickstart.md](../specs/005-comprehensive-testing/quickstart.md) - Quick reference

## Questions or Issues?

- Check quickstart.md for common troubleshooting steps
- Review research.md for architectural decisions
- Check test fixtures in `__tests__/fixtures/` for available test data
- Review existing tests for patterns and examples
