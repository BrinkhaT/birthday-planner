# Research: Comprehensive Testing for Non-Visual Logic

**Feature**: 005-comprehensive-testing
**Date**: 2025-10-30
**Phase**: 0 (Research & Best Practices)

## Overview

This document consolidates research findings for implementing comprehensive test coverage for the Birthday Planner application's non-visual logic (business logic, API routes, frontend hooks).

## Testing Framework Selection

### Decision: Jest 29.x

**Rationale**:
- Industry standard for Next.js/React applications
- Built-in TypeScript support via `ts-jest` or `@swc/jest`
- Excellent mocking capabilities (essential for filestore, API tests)
- Code coverage reporting built-in
- Parallel test execution for performance
- Snapshot testing for stable outputs
- Active maintenance and large community

**Alternatives Considered**:
- **Vitest**: Faster execution, but less mature ecosystem for Next.js
- **Mocha + Chai**: Requires more setup, less integrated with React ecosystem
- **Native Node.js test runner**: Too new, lacks React/Next.js utilities

**Configuration Approach**:
- Use `next/jest` preset for Next.js-specific setup
- Enable TypeScript support via `ts-jest` or SWC
- Configure module path aliases (@/ imports)
- Set coverage thresholds per spec requirements

## React Testing Library Selection

### Decision: @testing-library/react 16.x + @testing-library/react-hooks 8.x

**Rationale**:
- Official React testing utilities recommended by React team
- Hook testing via `renderHook` utility (React Testing Library 13+)
- Encourages testing behavior over implementation
- Excellent async utilities (`waitFor`, `findBy` queries)
- Active maintenance with React 19 support

**Alternatives Considered**:
- **Enzyme**: Deprecated, not recommended for new projects
- **React Test Renderer**: Too low-level, implementation-focused

**Hook Testing Pattern**:
- Use `renderHook` from `@testing-library/react` (React 18+)
- Mock global `fetch` for useEffect data loading tests
- Test state updates via `result.current` and `rerender`

## Next.js API Route Testing

### Decision: Next.js Testing Utilities + Node.js Mocks

**Rationale**:
- Next.js provides `createMocks` utility for Request/Response mocking
- Can test route handlers as pure functions
- No need for HTTP server during tests (faster execution)
- Works with Jest mocking for filestore dependencies

**Pattern**:
```typescript
import { GET, POST } from '@/app/api/birthdays/route';
import { NextRequest } from 'next/server';

// Mock filestore
jest.mock('@/lib/filestore');

// Test route handler
const req = new NextRequest('http://localhost:3000/api/birthdays');
const response = await GET();
```

**Alternatives Considered**:
- **Supertest**: Requires running actual server, slower
- **MSW (Mock Service Worker)**: Overkill for unit/integration tests

## File System Mocking Strategy

### Decision: jest.mock() with Manual Mocks

**Rationale**:
- Jest's `jest.mock()` automatically mocks all module exports
- Manual mocks in `__mocks__/` directory for fs/promises
- Allows testing atomic write behavior without actual file I/O
- Deterministic tests (no real file cleanup needed)

**Mock Structure**:
```
__mocks__/
└── fs/
    └── promises.ts  # Mock readFile, writeFile, rename, mkdir
```

**Testing Atomic Operations**:
- Mock `writeFile` and `rename` separately
- Verify `.tmp` file pattern used
- Test error handling (throw from mocks)

## Test Organization Best Practices

### Decision: __tests__/ Directory with unit/ and integration/ Subdirectories

**Rationale**:
- Standard Next.js/Jest convention
- Clear separation: unit tests (pure functions) vs integration tests (API routes)
- Mirrors source structure under `__tests__/unit/`
- Easy to run subsets: `jest __tests__/unit/` or `jest __tests__/integration/`

**Naming Convention**:
- `*.test.ts` for TypeScript files
- `*.test.tsx` for React component/hook tests
- Descriptive test names matching source files

## Mocking Patterns

### Global Fetch Mocking

**Pattern**: Use `jest.spyOn(global, 'fetch')` for frontend hook tests

```typescript
beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ birthdays: [] }),
  } as Response);
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### Module Mocking

**Pattern**: Use `jest.mock()` for filestore and other modules

```typescript
jest.mock('@/lib/filestore', () => ({
  readBirthdays: jest.fn(),
  writeBirthdays: jest.fn(),
}));

import { readBirthdays } from '@/lib/filestore';

// In test
(readBirthdays as jest.Mock).mockResolvedValue({ version: '1.0.0', birthdays: [] });
```

## Code Coverage Configuration

### Decision: Jest Built-in Coverage with Istanbul

**Coverage Thresholds** (per spec):
- **lib/*.ts**: 80% minimum (date-utils, validations, filestore)
- **app/api/**: 100% for routes (success + error paths)
- **app/page.tsx hooks**: 80% for state management logic

**Configuration**:
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'lib/**/*.ts',
    'app/api/**/*.ts',
    'app/page.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Performance Optimization

### Decision: Parallel Execution + Fast Transforms

**Strategies**:
- **Parallel tests**: Jest default (`--maxWorkers=50%`)
- **Fast TypeScript**: Use `@swc/jest` instead of `ts-jest` (10x faster)
- **Minimal setup**: Only load test-specific mocks
- **Cached transforms**: Jest caches transformed files

**Target**: < 10 seconds total execution (per SC-006)

**Benchmark Strategy**:
- Monitor test duration with `--verbose`
- Profile slow tests with `--detectSlowTestsMs`
- Optimize if needed (reduce setup, simplify mocks)

## Edge Case Testing Patterns

### Leap Year Testing

**Pattern**: Use fixed reference dates for deterministic tests

```typescript
describe('leap year handling', () => {
  it('handles Feb 29 in non-leap year', () => {
    const referenceDate = new Date('2025-02-28'); // Non-leap year
    const birthday = { birthDate: '2000-02-29', ... };
    const next = getNextOccurrence(birthday, referenceDate);
    expect(next.getMonth()).toBe(1); // February
    expect(next.getDate()).toBe(28); // Falls back to Feb 28
  });
});
```

### Concurrent Write Testing

**Pattern**: Mock atomic rename to verify no data loss

```typescript
it('uses atomic write pattern', async () => {
  const { writeFile, rename } = require('fs/promises');
  await writeBirthdays(store);

  // Verify temp file written first
  expect(writeFile).toHaveBeenCalledWith(
    expect.stringContaining('.tmp'),
    expect.any(String),
    'utf-8'
  );

  // Then atomically renamed
  expect(rename).toHaveBeenCalledWith(
    expect.stringContaining('.tmp'),
    expect.stringContaining('birthdays.json')
  );
});
```

## Documentation Testing

### Decision: Self-Documenting Tests with Descriptive Names

**Pattern**: Use Given/When/Then in test names

```typescript
describe('validateBirthdayDate', () => {
  it('returns error message when date is in the future', () => {
    // ...
  });

  it('returns null when date is valid DD.MM.YYYY format', () => {
    // ...
  });
});
```

## German Localization Testing

### Decision: Validate i18n-de.ts String Usage

**Pattern**: Test error messages match German strings

```typescript
import { i18nDE } from '@/lib/i18n-de';

it('returns German error message for empty name', () => {
  const error = validateBirthdayName('');
  expect(error).toBe(i18nDE.validation.nameRequired);
  expect(error).toBe('Name ist erforderlich');
});
```

## Docker Testing Strategy

### Decision: Test Compatibility, Full Suite in CI

**Local Development**:
- Run tests locally with `npm test`
- Fast iteration without Docker overhead

**Docker Verification** (SC-007):
- Add `npm test` to Dockerfile (optional test stage)
- Run in CI: `docker-compose run app npm test`
- Ensures consistency across environments

**No Changes to Production Dockerfile**:
- Tests run on host or in separate test stage
- Production image remains lean

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Test Framework | Jest 29.x | Industry standard, excellent Next.js support |
| React Testing | @testing-library/react 16.x | Official utilities, hook testing support |
| API Testing | Next.js utilities + mocks | Fast, no server needed |
| File Mocking | jest.mock() + manual mocks | Deterministic, isolated tests |
| Organization | __tests__/unit + integration | Standard convention, clear separation |
| Coverage | Jest built-in (Istanbul) | 80%+ thresholds, built-in reporting |
| Performance | Parallel + SWC transform | <10s execution target |
| Edge Cases | Fixed dates + atomic patterns | Deterministic, reliable tests |
| German i18n | Validate i18n-de.ts usage | Ensures localization compliance |
| Docker | Local + CI verification | Fast dev loop, production parity |

## Next Steps

Proceed to **Phase 1: Design & Contracts** to create:
1. `data-model.md` - Test data structures and fixtures
2. `quickstart.md` - How to run tests locally and in Docker
3. Update agent context with testing stack

