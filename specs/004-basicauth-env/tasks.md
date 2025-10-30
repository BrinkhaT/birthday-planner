# Implementation Tasks: Optional BasicAuth Protection

**Feature**: 004-basicauth-env
**Branch**: `004-basicauth-env`
**Generated**: 2025-10-30

## Task Summary

- **Total Tasks**: 15
- **User Story 1 (P1)**: 5 tasks (MVP - Enable BasicAuth)
- **User Story 2 (P2)**: 3 tasks (Disable BasicAuth - Default)
- **User Story 3 (P3)**: 3 tasks (Configure Credentials)
- **Foundational**: 2 tasks
- **Polish**: 2 tasks
- **Parallelizable**: 6 tasks marked with [P]

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
**User Story 1 only**: Enable BasicAuth Protection
- Delivers core value: Optional authentication for secure deployment
- Independently testable with all 5 acceptance scenarios
- Estimated effort: 5 tasks (~2-3 hours)

### Incremental Delivery
1. **Phase 1 (MVP)**: User Story 1 - Enable BasicAuth Protection
2. **Phase 2**: User Story 2 - Disable BasicAuth (Default Behavior)
3. **Phase 3**: User Story 3 - Configure BasicAuth Credentials
4. **Phase 4**: Polish & Documentation

Each phase delivers independently testable value.

---

## Phase 1: Foundational Setup

**Purpose**: Create core infrastructure files needed by all user stories

### Tasks

- [X] T001 [P] Create authentication utility library at lib/auth.ts with TypeScript interfaces for auth config
- [X] T002 Create Next.js instrumentation file at instrumentation.ts for startup validation

**Completion Criteria**:
- ✅ lib/auth.ts exists with type definitions
- ✅ instrumentation.ts exists with register() function
- ✅ No runtime errors when importing these files

---

## Phase 2: User Story 1 - Enable BasicAuth Protection (Priority: P1)

**Story Goal**: Administrator can enable BasicAuth via environment variable to secure pages and APIs

**Independent Test**: Set ENABLE_BASICAUTH=true, BASICAUTH_USERNAME=test, BASICAUTH_PASSWORD=secret, start app, verify browser prompts for credentials, verify authenticated access works, verify 401 on wrong/missing credentials

**Acceptance Scenarios**:
1. ✅ Browser shows auth dialog when accessing home page without credentials
2. ✅ Correct credentials grant access to birthday list page
3. ✅ Incorrect credentials show error and re-prompt
4. ✅ API endpoints return 401 without credentials
5. ✅ API endpoints work normally when authenticated

### Tasks

- [X] T003 [P] [US1] Implement validateBasicAuth() function in lib/auth.ts with Base64 decoding and constant-time credential comparison using Node.js Buffer API
- [X] T004 [P] [US1] Implement credential validation logic in instrumentation.ts that checks ENABLE_BASICAUTH, BASICAUTH_USERNAME, BASICAUTH_PASSWORD environment variables and calls process.exit(1) with German error message if credentials missing when enabled
- [X] T005 [US1] Create Next.js Edge Middleware at middleware.ts that checks ENABLE_BASICAUTH env var, validates Authorization header using lib/auth.ts, returns 401 with German WWW-Authenticate realm if invalid, returns NextResponse.next() if valid or disabled
- [X] T006 [US1] Configure middleware matcher in middleware.ts to protect all pages (/) and API routes (/api/:path*) using export config with matcher array
- [X] T007 [US1] Test User Story 1 acceptance scenarios: start app with ENABLE_BASICAUTH=true and credentials, verify browser auth dialog appears, test valid/invalid credentials, verify API protection with curl/Postman

**Story Dependencies**: None (first story, MVP)

**Parallel Execution**:
- Tasks T003 and T004 can run in parallel (different concerns: validation logic vs startup check)
- Task T005 depends on T003 (needs validateBasicAuth function)
- Task T006 depends on T005 (needs middleware function)
- Task T007 is final integration test

---

## Phase 3: User Story 2 - Disable BasicAuth (Default Behavior) (Priority: P2)

**Story Goal**: Administrator can run application without authentication (default mode) for trusted network deployment

**Independent Test**: Start app without ENABLE_BASICAUTH set (or set to false), verify home page loads immediately, verify no auth prompts, verify all APIs work without credentials

**Acceptance Scenarios**:
1. ✅ Home page loads immediately without auth prompt when ENABLE_BASICAUTH not set
2. ✅ API endpoints work without credentials when disabled
3. ✅ Explicit disable (ENABLE_BASICAUTH=false) behaves identically to unset

### Tasks

- [X] T008 [P] [US2] Add early return logic to middleware.ts that checks if ENABLE_BASICAUTH !== 'true' and immediately returns NextResponse.next() before any auth checks
- [X] T009 [P] [US2] Add info logging to instrumentation.ts that outputs "ℹ BasicAuth ist deaktiviert" when ENABLE_BASICAUTH is not enabled
- [X] T010 [US2] Test User Story 2 acceptance scenarios: start app without ENABLE_BASICAUTH, verify no auth prompts, test with ENABLE_BASICAUTH=false, verify identical behavior, test all API endpoints work

**Story Dependencies**: Depends on User Story 1 (T005 middleware must exist)

**Parallel Execution**:
- Tasks T008 and T009 can run in parallel (different files)
- Task T010 is final integration test

---

## Phase 4: User Story 3 - Configure BasicAuth Credentials (Priority: P3)

**Story Goal**: Administrator can configure custom username/password via environment variables

**Independent Test**: Set custom BASICAUTH_USERNAME and BASICAUTH_PASSWORD, restart app, verify only new credentials work, change credentials, verify old credentials rejected and new ones accepted

**Acceptance Scenarios**:
1. ✅ Custom credentials from env vars grant access
2. ✅ Missing credentials when enabled cause startup failure with German error
3. ✅ Changed credentials after restart: old rejected, new accepted
4. ✅ New credentials work correctly

### Tasks

- [X] T011 [P] [US3] Enhance instrumentation.ts credential validation to check for empty/undefined BASICAUTH_USERNAME or BASICAUTH_PASSWORD when ENABLE_BASICAUTH=true, output German error messages with clear guidance
- [X] T012 [P] [US3] Update docker-compose.yml to add environment variables: ENABLE_BASICAUTH, BASICAUTH_USERNAME, BASICAUTH_PASSWORD with example commented values and security warnings
- [X] T013 [US3] Test User Story 3 acceptance scenarios: test with custom credentials, test startup failure with missing credentials, test credential change workflow, verify old credentials rejected after change

**Story Dependencies**: Depends on User Story 1 (T004 instrumentation must exist)

**Parallel Execution**:
- Tasks T011 and T012 can run in parallel (different files)
- Task T013 is final integration test

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation updates, and production readiness

### Tasks

- [X] T014 Run full integration test suite covering all three user stories in both development (npm run dev) and Docker (docker-compose up) environments, verify all acceptance scenarios pass
- [X] T015 Update CLAUDE.md Active Technologies section to document optional BasicAuth feature with environment variable configuration, add note about German error messages and fail-fast validation

**Completion Criteria**:
- ✅ All user story acceptance scenarios pass in dev and Docker
- ✅ Documentation updated with new feature
- ✅ No regression in existing birthday CRUD functionality

---

## Dependencies Graph

```
Foundational:
  T001 (lib/auth.ts) ────┐
  T002 (instrumentation.ts) ─┐
                             │
User Story 1 (MVP):          │
  T003 (validateBasicAuth) ──┴─→ T005 (middleware.ts) → T006 (middleware config) → T007 (US1 test)
  T004 (startup validation) ────┘

User Story 2:
  T008 (disable logic) ──┬→ T010 (US2 test)
  T009 (disable logging) ┘
  [Depends on T005 from US1]

User Story 3:
  T011 (credential validation) ─┬→ T013 (US3 test)
  T012 (docker-compose update) ──┘
  [Depends on T004 from US1]

Polish:
  T014 (full integration test) [Depends on all stories]
  T015 (documentation update) [Can run in parallel with T014]
```

---

## Task Execution Guide

### For MVP Delivery (User Story 1 Only)

Execute tasks in this order:
1. **Parallel**: T001, T002 (foundational files)
2. **Parallel**: T003, T004 (validation logic)
3. **Sequential**: T005 → T006 (middleware creation and configuration)
4. **Test**: T007 (verify User Story 1)

**Result**: Functional BasicAuth protection, independently testable, production-ready

### For Complete Feature

Continue from MVP with:
1. **User Story 2**: T008, T009 (parallel) → T010 (test)
2. **User Story 3**: T011, T012 (parallel) → T013 (test)
3. **Polish**: T014, T015 (parallel final tasks)

---

## Testing Checkpoints

### After User Story 1 (MVP)
- [ ] Browser shows auth dialog when accessing http://localhost:3000
- [ ] Correct credentials (from env vars) grant access
- [ ] Wrong credentials show error and re-prompt
- [ ] API endpoints return 401 without Authorization header
- [ ] API endpoints work with valid Authorization header
- [ ] Application fails to start if ENABLE_BASICAUTH=true but credentials missing

### After User Story 2
- [ ] Application starts successfully without ENABLE_BASICAUTH
- [ ] No auth prompts when disabled
- [ ] All pages and APIs accessible without credentials
- [ ] Console shows "ℹ BasicAuth ist deaktiviert"

### After User Story 3
- [ ] Custom username/password from env vars work correctly
- [ ] Startup failure with clear German error when credentials missing
- [ ] Credential changes take effect after container restart
- [ ] Old credentials rejected after change

### After Polish Phase
- [ ] All acceptance scenarios pass in development mode
- [ ] All acceptance scenarios pass in Docker mode
- [ ] No regression in existing birthday CRUD features
- [ ] Documentation reflects new optional auth feature

---

## File Inventory

### New Files (3)
- `middleware.ts` - Next.js Edge Middleware for BasicAuth (~50 lines)
- `lib/auth.ts` - Authentication utilities (~30 lines)
- `instrumentation.ts` - Startup validation (~25 lines)

### Modified Files (1)
- `docker-compose.yml` - Add 3 environment variables

### No Changes Required
- `Dockerfile` - Environment variables passed at runtime
- `app/**` - All pages and API routes protected automatically by middleware
- `data/birthdays.json` - No data schema changes
- `components/**` - No UI changes (browser handles auth dialog)

---

## Constitution Compliance Validation

### Checklist for Implementation

- [ ] **Simplicity First**: Zero external dependencies used (only Node.js built-ins)
- [ ] **Simplicity First**: No config files added (env vars only)
- [ ] **Responsive Design**: No UI changes made (existing responsive design unchanged)
- [ ] **Docker-First**: Environment variables configured in docker-compose.yml
- [ ] **German Localization**: Error messages in German, WWW-Authenticate realm in German
- [ ] **Optional Auth**: Default behavior is disabled (ENABLE_BASICAUTH defaults to false)
- [ ] **Fail-Fast**: Application exits with error if misconfigured
- [ ] **Zero Overhead**: Early return in middleware when disabled

---

## Notes

- **No test files**: Manual testing specified in plan.md, no automated tests requested in spec
- **No data-model.md**: No new entities (infrastructure-level feature)
- **No contracts/**: No API changes (adds auth layer only)
- **Parallel opportunities**: 6 tasks marked [P] can run concurrently
- **MVP-first approach**: User Story 1 is independently valuable and testable
- **Backward compatibility**: Default disabled mode ensures no breaking changes
