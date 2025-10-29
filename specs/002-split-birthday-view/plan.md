# Implementation Plan: Split Birthday View

**Branch**: `002-split-birthday-view` | **Date**: 2025-10-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-split-birthday-view/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Restructure the birthday overview page into two distinct sections: Section 1 displays upcoming birthdays (next 30 days) as cards with name, age, and date sorted ascending; Section 2 displays all other birthdays (day 31 through yesterday + 1 year) as a table with date, name, and age. The technical approach involves refactoring the existing Next.js page component to include date range calculation logic, splitting birthday data into two arrays, and creating a new table component alongside the existing card component.

## Technical Context

**Language/Version**: TypeScript 5.9+, Next.js 16 with App Router, React 19
**Primary Dependencies**: ShadCN UI components, Tailwind CSS, Lucide React icons
**Storage**: JSON FileStore (existing - no changes required)
**Testing**: Manual testing across viewport sizes (320px, 768px, 1920px)
**Target Platform**: Web browser (Chrome, Firefox, Safari), mobile-first responsive design
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Page load < 1 second, instant section rendering
**Constraints**: Responsive design 320px-1920px, mobile-first approach, no authentication
**Scale/Scope**: ~50 UI elements (cards + table rows), 2 main sections, 1 page refactor

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### SpecKit-Driven Development ✅
- [x] Feature started with `/speckit.specify` (spec.md created)
- [x] Currently executing `/speckit.plan` for implementation planning
- [x] Tasks will be generated with `/speckit.tasks` before implementation
- [x] Implementation will use `/speckit.implement`

### Simplicity First ✅
- [x] Reuses existing JSON FileStore (no new data layer)
- [x] Simple date range calculation logic (no external date libraries)
- [x] Direct component implementation (no new abstractions)
- [x] Minimal changes to existing architecture

### Responsive Design ✅
- [x] Mobile-first design approach maintained
- [x] ShadCN components for UI consistency
- [x] Table component must be responsive (320px-1920px)
- [x] Touch-friendly on mobile devices

### Docker-First Deployment ✅
- [x] No changes to Docker configuration required
- [x] No new dependencies or build steps
- [x] Existing Dockerfile remains functional

### No Authentication Required ✅
- [x] No authentication changes (feature is UI-only)
- [x] Direct access to both sections without login

**Status**: All gates PASSED. Feature complies with all constitutional principles.

## Project Structure

### Documentation (this feature)

```text
specs/002-split-birthday-view/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── api/
│   └── birthdays/
│       └── route.ts         # Existing - no changes
├── page.tsx                 # MODIFY - split into two sections
└── layout.tsx               # Existing - no changes

components/
├── ui/                      # ShadCN components - no changes
├── birthday-card.tsx        # Existing - no changes
└── birthday-table.tsx       # NEW - table component for Section 2

lib/
├── filestore.ts             # Existing - no changes
└── date-utils.ts            # NEW - date range calculation utilities

types/
└── birthday.ts              # Existing - no changes (might add helper types)

data/
└── birthdays.json           # Existing - no changes
```

**Structure Decision**: This is a web application using Next.js App Router. The feature involves UI refactoring only - no backend API changes, no data model changes, no Docker configuration changes. We'll add date utility functions and a new table component while modifying the existing page component to split birthdays into two sections.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. Feature maintains constitutional compliance.
