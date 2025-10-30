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

  // Module name mapper (for @/ imports and Node.js built-in mocks)
  moduleNameMapper: {
    '^fs/promises$': '<rootDir>/__mocks__/fs/promises.js',
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

  coverageThreshold: {
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
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
};

module.exports = createJestConfig(customJestConfig);
