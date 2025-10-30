# Quickstart: Running Tests

**Feature**: 005-comprehensive-testing
**Date**: 2025-10-30
**Phase**: 1 (Design & Contracts)

## Prerequisites

- Node.js 20.x or higher
- npm (bundled with Node.js)
- Docker (optional, for production parity testing)

## Installation

Install test dependencies:

```bash
npm install --save-dev \
  jest@^29.0.0 \
  @testing-library/react@^16.0.0 \
  @testing-library/react-hooks@^8.0.0 \
  @types/jest@^29.0.0 \
  jest-environment-jsdom@^29.0.0 \
  @swc/jest@^0.2.0
```

## Running Tests

### Run All Tests

```bash
npm test
```

This runs all unit and integration tests in parallel.

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

Automatically re-runs tests when files change. Ideal for TDD workflow.

### Run Specific Test Suites

```bash
# Unit tests only
npm test __tests__/unit

# Integration tests only
npm test __tests__/integration

# Specific file
npm test date-utils.test.ts
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

Generates coverage report in `coverage/` directory and displays summary in terminal.

### View Coverage Report

```bash
# After running with --coverage
open coverage/lcov-report/index.html
```

Opens HTML coverage report in browser.

## Test Scripts (package.json)

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest __tests__/unit",
    "test:integration": "jest __tests__/integration",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Configuration Files

### jest.config.js

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Path to Next.js app
  dir: './',
});

const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module name mapper (for @/ imports)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Coverage configuration
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

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],

  // Transform with SWC (faster than ts-jest)
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};

module.exports = createJestConfig(customJestConfig);
```

### jest.setup.js

```javascript
// Extend Jest matchers
import '@testing-library/jest-dom';

// Mock environment variables
process.env.DATA_DIR = '/tmp/test-data';

// Global test utilities
global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
```

## Running Tests in Docker

### Build Test Image

```bash
docker-compose build
```

### Run Tests in Container

```bash
docker-compose run app npm test
```

### Run Tests with Coverage in Docker

```bash
docker-compose run app npm test -- --coverage
```

## Test Output

### Successful Test Run

```
PASS  __tests__/unit/lib/date-utils.test.ts
  ✓ parseBirthDate - parses ISO full date (2 ms)
  ✓ parseBirthDate - parses ISO short date (1 ms)
  ✓ isLeapYear - returns true for leap year (1 ms)
  ✓ getNextOccurrence - handles Feb 29 in non-leap year (2 ms)

Test Suites: 5 passed, 5 total
Tests:       42 passed, 42 total
Snapshots:   0 total
Time:        8.234 s
```

### Failed Test

```
FAIL  __tests__/unit/lib/validations.test.ts
  ✕ validateBirthdayDate - rejects future date (12 ms)

  Expected: "Geburtsdatum kann nicht in der Zukunft liegen"
  Received: null

  at Object.<anonymous> (validations.test.ts:45:23)

Test Suites: 1 failed, 4 passed, 5 total
Tests:       1 failed, 41 passed, 42 total
```

### Coverage Report

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   91.23 |    88.46 |   94.12 |   91.23 |
 lib/               |   95.45 |    92.31 |   100   |   95.45 |
  date-utils.ts     |   98.76 |    95.24 |   100   |   98.76 | 87
  validations.ts    |   100   |    100   |   100   |   100   |
  filestore.ts      |   88.24 |    80.00 |   100   |   88.24 | 34-37
 app/api/           |   100   |    100   |   100   |   100   |
  birthdays/        |   100   |    100   |   100   |   100   |
 app/               |   82.35 |    75.00 |   85.71 |   82.35 |
  page.tsx          |   82.35 |    75.00 |   85.71 |   82.35 | 145-148,203-206
--------------------|---------|----------|---------|---------|-------------------
```

## Debugging Tests

### Run Single Test with Debugging

```bash
node --inspect-brk node_modules/.bin/jest --runInBand date-utils.test.ts
```

Then attach Chrome DevTools (chrome://inspect).

### Verbose Output

```bash
npm test -- --verbose
```

Shows all test names and execution details.

### Detect Slow Tests

```bash
npm test -- --detectSlowTestsMs=1000
```

Warns about tests taking longer than 1 second.

## Troubleshooting

### Tests Fail with Module Not Found

**Problem**: `Cannot find module '@/lib/date-utils'`

**Solution**: Check `moduleNameMapper` in jest.config.js matches your tsconfig.json paths:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### Tests Fail with Unexpected Token

**Problem**: `SyntaxError: Unexpected token 'export'`

**Solution**: Ensure `@swc/jest` or `ts-jest` is configured in jest.config.js:

```javascript
transform: {
  '^.+\\.(t|j)sx?$': ['@swc/jest'],
}
```

### Coverage Thresholds Not Met

**Problem**: `Jest: "global" coverage threshold for statements (80%) not met: 75%`

**Solution**:
1. Check which files are uncovered: `npm test -- --coverage`
2. Add missing tests for uncovered lines
3. Alternatively, adjust thresholds in jest.config.js (if justified)

### Tests Run Slowly

**Problem**: Test suite takes > 10 seconds

**Solution**:
1. Check for synchronous delays (e.g., `setTimeout` not mocked)
2. Ensure parallel execution: `npm test -- --maxWorkers=50%`
3. Use `@swc/jest` instead of `ts-jest` for faster transforms
4. Profile slow tests: `npm test -- --detectSlowTestsMs=500`

### Mock Not Working

**Problem**: Mock not being called or not returning expected value

**Solution**:
1. Ensure mock is defined **before** importing module:
   ```typescript
   jest.mock('@/lib/filestore');
   import { readBirthdays } from '@/lib/filestore';
   ```
2. Check mock is typed correctly:
   ```typescript
   (readBirthdays as jest.Mock).mockResolvedValue(...);
   ```
3. Clear mocks between tests:
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

## CI/CD Integration (Future)

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --ci --coverage --maxWorkers=2
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm test -- --watch` | Run tests in watch mode |
| `npm test -- --coverage` | Run tests with coverage |
| `npm test __tests__/unit` | Run unit tests only |
| `npm test __tests__/integration` | Run integration tests only |
| `npm test -- --verbose` | Show detailed test output |
| `npm test date-utils` | Run specific test file |

## Success Criteria Verification

After running tests, verify success criteria:

- ✅ **SC-001**: Date calculation tests cover leap years, year boundaries, Feb 29
- ✅ **SC-002**: Validation tests cover all error conditions
- ✅ **SC-003**: Filestore tests achieve 90%+ coverage
- ✅ **SC-004**: API route tests cover 100% success + error responses
- ✅ **SC-005**: Hook tests achieve 80%+ coverage
- ✅ **SC-006**: Test suite executes in < 10 seconds
- ✅ **SC-007**: Tests executable in Docker environment
- ✅ **SC-008**: Zero warnings or errors (clean run)

## Next Steps

1. Review test output and coverage report
2. Add missing tests for uncovered code
3. Fix any failing tests
4. Integrate into CI/CD pipeline (optional)
5. Document any test-specific patterns or gotchas

## Support

For issues or questions:
- Check [Jest documentation](https://jestjs.io/docs/getting-started)
- Check [React Testing Library docs](https://testing-library.com/docs/react-testing-library/intro)
- Review test fixtures in `__tests__/fixtures/`
- Review research.md for testing patterns
