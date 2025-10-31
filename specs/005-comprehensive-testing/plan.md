# Implementation Plan: Comprehensive Testing for Non-Visual Logic

**Branch**: `005-comprehensive-testing` | **Date**: 2025-10-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-comprehensive-testing/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement comprehensive test coverage for all non-visual areas of the Birthday Planner application, including business logic (date calculations, validations, file storage), API routes, and frontend hooks/state management. Tests will use Jest as the primary framework with React Testing Library for hook testing, achieving minimum 80% coverage for non-visual modules with execution time under 10 seconds.

## Technical Context

**Language/Version**: TypeScript 5.9+ / Node.js 20.x
**Primary Dependencies**: Jest 29.x, @testing-library/react 16.x, @testing-library/react-hooks 8.x, @types/jest 29.x
**Storage**: N/A (testing infrastructure - tests will mock filestore operations)
**Testing**: Jest (unit + integration), React Testing Library (hooks), Next.js testing utilities (API routes)
**Target Platform**: Node.js 20+ (local development + Docker Alpine)
**Project Type**: Web application (Next.js 16 with App Router)
**Performance Goals**: Test suite execution < 10 seconds, parallel test execution enabled
**Constraints**: Zero external dependencies during test execution, no production data directory writes, deterministic tests only
**Scale/Scope**: 5 test suites (date-utils, validations, filestore, API routes, hooks), 80%+ coverage for lib/*.ts files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: SpecKit-Driven Development ✅ PASS
- Feature created via `/speckit.specify`
- Clarification phase completed via `/speckit.clarify` (no ambiguities found)
- Currently in `/speckit.plan` phase
- Will generate tasks via `/speckit.tasks` before implementation
- Will implement via `/speckit.implement`

### Principle II: Simplicity First ✅ PASS
- Uses industry-standard Jest (no custom test framework)
- Leverages existing Next.js/React testing patterns
- No new database or complex systems
- Test files co-located with source code (simple organization)
- Mocking strategy minimizes test complexity

### Principle III: Responsive Design ✅ PASS (N/A)
- Testing infrastructure feature - no UI components
- Does not affect existing responsive design

### Principle IV: Docker-First Deployment ✅ PASS
- Tests executable in Docker environment (SC-007)
- No changes to Dockerfile required
- Test execution isolated from production data
- Compatible with existing Docker Alpine base image

### Principle V: Optional Authentication ✅ PASS (N/A)
- Testing infrastructure feature - no authentication logic changes
- Tests will validate existing authentication behavior where applicable

### Principle VI: German Localization ✅ PASS
- Tests validate German error messages (FR-010)
- Tests check i18n-de.ts string usage
- No German UI text required for test infrastructure itself

### Technology Stack Requirements ✅ PASS
- **Frontend Framework**: Next.js (existing) - no changes
- **UI Components**: ShadCN (existing) - no changes
- **Data Storage**: JSON FileStore (existing) - mocked in tests
- **Containerization**: Docker compatible
- **Testing**: Jest + React Testing Library (standard, no prohibited tech)

### GATE STATUS: ✅ PASSED - All constitutional requirements met

## Project Structure

### Documentation (this feature)

```text
specs/005-comprehensive-testing/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (testing best practices & patterns)
├── data-model.md        # Phase 1 output (test data structures)
├── quickstart.md        # Phase 1 output (how to run tests)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Next.js Web Application with Test Infrastructure

# Test files (new - created by this feature)
__tests__/
├── unit/
│   ├── lib/
│   │   ├── date-utils.test.ts        # Date calculation tests
│   │   ├── validations.test.ts       # Validation & conversion tests
│   │   ├── filestore.test.ts         # File storage tests
│   │   └── i18n-de.test.ts           # German localization tests (optional)
│   └── app/
│       └── page.test.tsx              # Hook logic tests
└── integration/
    └── api/
        ├── birthdays.test.ts          # GET /api/birthdays
        ├── birthdays-create.test.ts   # POST /api/birthdays/create
        └── birthdays-id.test.ts       # PUT/DELETE /api/birthdays/[id]

# Test configuration (new)
jest.config.js                         # Jest configuration
jest.setup.js                          # Jest setup file
.github/                               # (future) CI/CD workflows
  └── workflows/
      └── test.yml                     # (future) GitHub Actions

# Existing application code (unchanged)
app/
├── api/
│   └── birthdays/
│       ├── route.ts                   # GET endpoint
│       ├── create/route.ts            # POST endpoint
│       └── [id]/route.ts              # PUT/DELETE endpoints
├── page.tsx                           # Main page with hooks
└── layout.tsx

lib/
├── date-utils.ts                      # Business logic
├── validations.ts                     # Validation functions
├── filestore.ts                       # File operations
├── i18n-de.ts                         # German localization
└── utils.ts

types/
└── birthday.ts                        # TypeScript types

components/                            # (excluded from this feature)
data/                                  # (not touched by tests)
```

**Structure Decision**:
- **Test Organization**: `__tests__/` directory at repository root with subdirectories for `unit/` and `integration/` tests
- **Naming Convention**: `*.test.ts` or `*.test.tsx` suffix for all test files
- **Mirror Structure**: Test files mirror source structure under `__tests__/unit/` (e.g., `lib/date-utils.ts` → `__tests__/unit/lib/date-utils.test.ts`)
- **Integration Tests**: Separate `__tests__/integration/` directory for API route tests
- **Configuration**: Jest config at repository root for easy discovery
- **Rationale**: Standard Next.js testing convention, clear separation of concerns, supports parallel execution

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: ✅ No constitutional violations - complexity tracking not required

All constitutional principles are satisfied. Testing infrastructure uses standard industry tools (Jest, React Testing Library) without introducing unnecessary complexity.
