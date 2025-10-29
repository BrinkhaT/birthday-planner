---

description: "Task list for tech baseline implementation"
---

# Tasks: Tech Baseline - Birthday List Display

**Input**: Design documents from `specs/001-tech-baseline/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Tests are NOT requested for this baseline feature. Focus on functional implementation only.

**Organization**: Tasks are organized by setup, foundational infrastructure, and the single user story (P1).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

- Next.js App Router: `app/`, `components/`, `lib/` at repository root
- Paths shown below use Next.js project structure

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project and install dependencies

- [X] T001 Create Next.js application with TypeScript, Tailwind CSS, and App Router
- [X] T002 [P] Initialize ShadCN UI with default configuration
- [X] T003 [P] Create project directory structure (app/, components/, lib/, data/)
- [X] T004 [P] Create TypeScript types file at types/birthday.ts
- [X] T005 Install ShadCN Card component

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: User Story 1 cannot begin until this phase is complete

- [X] T006 Create initial birthdays.json seed file in data/ directory with three test birthdays (Paula, Thomas, Isabel)
- [X] T007 [P] Implement FileStore module in lib/filestore.ts with readBirthdays and writeBirthdays functions
- [X] T008 [P] Create utility functions in lib/utils.ts for date formatting and validation
- [X] T009 [P] Configure environment variables in .env.local for DATA_DIR
- [X] T010 Create Next.js root layout in app/layout.tsx with mobile-first responsive meta tags

**Checkpoint**: Foundation ready - User Story 1 implementation can now begin

---

## Phase 3: User Story 1 - View Upcoming Birthdays (Priority: P1) 🎯 MVP

**Goal**: Display a list of all birthdays fetched from API in a responsive, mobile-first layout

**Independent Test**: Open application in browser, verify three test birthdays (Paula, Thomas, Isabel) display correctly with names and dates on mobile (320px) and desktop (1920px) viewports

### Implementation for User Story 1

- [X] T011 [P] [US1] Create GET /api/birthdays route handler in app/api/birthdays/route.ts
- [X] T012 [P] [US1] Create BirthdayCard component in components/birthday-card.tsx using ShadCN Card
- [X] T013 [US1] Implement home page in app/page.tsx with API data fetching and birthday list rendering
- [X] T014 [US1] Add loading state UI in app/page.tsx
- [X] T015 [US1] Add error state UI in app/page.tsx for API failures
- [X] T016 [US1] Add responsive CSS styling with Tailwind for mobile (320px), tablet (768px), and desktop (1920px) viewports
- [X] T017 [US1] Test responsive layout across all viewport sizes (320px, 768px, 1920px)

**Checkpoint**: User Story 1 is complete and independently testable. Application shows birthday list on all device sizes.

---

## Phase 4: Docker & Deployment

**Purpose**: Containerize application for home lab deployment

- [X] T018 [P] Create Dockerfile with multi-stage build (build and production stages)
- [X] T019 [P] Create docker-compose.yml with volume mount for /data directory
- [X] T020 [P] Create .dockerignore file
- [X] T021 Configure Next.js for standalone output in next.config.js
- [X] T022 Build and test Docker image locally
- [X] T023 Verify volume mount persists data across container restarts

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and validation

- [X] T024 [P] Add README.md with quickstart instructions
- [X] T025 [P] Validate all acceptance scenarios from spec.md
- [X] T026 [P] Test page load time (must be under 2 seconds per SC-001)
- [X] T027 [P] Verify no horizontal scrolling on any device size (SC-005)
- [X] T028 Run complete validation checklist from quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS User Story 1
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **Docker (Phase 4)**: Depends on User Story 1 completion
- **Polish (Phase 5)**: Depends on Docker phase completion

### Within User Story 1

- API route (T011) and component (T012) can be built in parallel
- Home page (T013) depends on both API route and component
- Loading/error states (T014, T015) depend on home page
- Styling (T016) depends on home page and component
- Testing (T017) depends on all implementation tasks

### Parallel Opportunities

```bash
# Phase 1 - All can run in parallel after T001:
Task: "Initialize ShadCN UI"
Task: "Create directory structure"
Task: "Create TypeScript types"
Task: "Install ShadCN Card component"

# Phase 2 - Several can run in parallel:
Task: "Implement FileStore module"
Task: "Create utility functions"
Task: "Configure environment variables"

# Phase 3 - API and component can start together:
Task: "Create GET /api/birthdays route"
Task: "Create BirthdayCard component"

# Phase 4 - All Docker tasks can run in parallel:
Task: "Create Dockerfile"
Task: "Create docker-compose.yml"
Task: "Create .dockerignore"

# Phase 5 - All validation tasks can run in parallel:
Task: "Add README.md"
Task: "Validate acceptance scenarios"
Task: "Test page load time"
Task: "Verify no horizontal scrolling"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup → Next.js project initialized
2. Complete Phase 2: Foundational → Core infrastructure ready
3. Complete Phase 3: User Story 1 → Birthday list displays
4. **STOP and VALIDATE**: Test on mobile (320px) and desktop (1920px)
5. Verify all three test birthdays visible
6. Verify loading and error states work
7. Complete Phase 4: Docker → Ready for deployment
8. Complete Phase 5: Polish → Production ready

### Success Validation

After User Story 1 completion, verify:
- ✅ Application loads without errors
- ✅ Three birthdays (Paula, Thomas, Isabel) display with names and dates
- ✅ Responsive on 320px mobile width
- ✅ Responsive on 1920px desktop width
- ✅ No horizontal scrolling on any device
- ✅ Loading indicator shows during data fetch
- ✅ Error message shows if API fails
- ✅ Page loads in under 2 seconds

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1
- This is a single user story feature (MVP baseline)
- No tests requested - focus on functional implementation
- Commit after each task or logical group
- Stop at checkpoint to validate independently
- Docker phase ensures deployment readiness
- All acceptance scenarios from spec.md must pass

---

## Task Count Summary

- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **Phase 3 (User Story 1)**: 7 tasks
- **Phase 4 (Docker)**: 6 tasks
- **Phase 5 (Polish)**: 5 tasks
- **Total**: 28 tasks

**Parallel Opportunities**: 13 tasks marked [P] can run in parallel within their phases

**MVP Scope**: Phases 1-3 (17 tasks) deliver the core birthday list display functionality
