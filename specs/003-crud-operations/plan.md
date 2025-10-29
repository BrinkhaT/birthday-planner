# Implementation Plan: Birthday Entry Management (CRUD Operations)

**Branch**: `003-crud-operations` | **Date**: 2025-10-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-crud-operations/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add CRUD (Create, Read, Update, Delete) operations to the birthday planner application, allowing users to add, edit, and delete birthday entries through modal dialogs with icon buttons. All operations include form validation, and delete operations require user confirmation. The feature builds on the existing birthday list display (card and table views) and maintains data persistence through the existing JSON FileStore.

## Technical Context

**Language/Version**: TypeScript 5.9+, Node.js 20.x
**Primary Dependencies**: Next.js 16 (App Router), React 19, ShadCN UI components, Lucide React (icons), Tailwind CSS
**Storage**: JSON FileStore (file-based persistence at /data/birthdays.json)
**Testing**: NEEDS CLARIFICATION (test framework not yet established)
**Target Platform**: Web application (Docker container on home lab internal network)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Sub-second response for CRUD operations, instant UI updates
**Constraints**: Responsive design (320px-1920px), German localization (de-DE), no authentication required
**Scale/Scope**: Single-user home lab deployment, <100 birthday entries expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: SpecKit-Driven Development
✅ **PASS** - Feature follows full SpecKit workflow: `/speckit.specify` completed, now executing `/speckit.plan`

### Principle II: Simplicity First
✅ **PASS** - Uses existing JSON FileStore, no new database or complex abstractions. Direct modal component implementation without over-engineering.

### Principle III: Responsive Design
✅ **PASS** - Requirements specify responsive modal dialogs (320px-1920px). Will use ShadCN components which are mobile-first.

### Principle IV: Docker-First Deployment
✅ **PASS** - No changes to Docker deployment. Data persistence continues via existing /data volume mount.

### Principle V: No Authentication Required
✅ **PASS** - Feature operates within existing unauthenticated application. No auth mechanisms added.

### Principle VI: German Localization
✅ **PASS** - All UI text (button labels, modal titles, validation messages, confirmation dialogs) will be in German. Date format remains DD.MM.YYYY. Locale de-DE maintained.

### Technology Stack Requirements
✅ **PASS** - Uses mandated stack: Next.js, ShadCN, JSON FileStore, Docker. No prohibited technologies introduced.

### Development Workflow
✅ **PASS** - Following incremental delivery with 3 prioritized user stories (P1: Add, P2: Edit, P3: Delete).

**GATE STATUS**: ✅ **PASSED** - All constitutional principles satisfied. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/003-crud-operations/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
├── contracts/           # Phase 1 output (to be created)
│   └── api.yaml         # OpenAPI spec for CRUD endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/                           # Next.js App Router
├── api/                       # API routes
│   └── birthdays/
│       ├── route.ts           # GET /api/birthdays (existing)
│       ├── [id]/
│       │   └── route.ts       # PUT/DELETE /api/birthdays/[id] (new)
│       └── create/
│           └── route.ts       # POST /api/birthdays/create (new)
├── page.tsx                   # Home page with birthday list (existing)
└── layout.tsx                 # Root layout (existing)

components/                    # React components
├── ui/                        # ShadCN UI components
│   ├── dialog.tsx             # Dialog/Modal component (to be added)
│   ├── button.tsx             # Button component (existing)
│   ├── card.tsx               # Card component (existing)
│   └── ...                    # Other ShadCN components
├── birthday-card.tsx          # Birthday card component (existing - to be enhanced)
├── birthday-table.tsx         # Birthday table component (existing - to be enhanced)
├── birthday-form.tsx          # Form for add/edit (new)
├── birthday-modal.tsx         # Modal wrapper for CRUD operations (new)
└── delete-confirmation.tsx    # Delete confirmation dialog (new)

lib/                           # Utility functions and services
├── filestore.ts               # JSON FileStore implementation (existing)
├── utils.ts                   # Utility functions (existing)
└── validations.ts             # Form validation helpers (new)

types/                         # TypeScript type definitions
└── birthday.ts                # Birthday type definitions (existing)

data/                          # JSON data storage (Docker volume mount)
└── birthdays.json             # Birthday data file (existing)
```

**Structure Decision**: Next.js App Router web application structure. The feature extends existing components (birthday-card, birthday-table) with action buttons and adds new modal components for CRUD operations. API routes follow Next.js App Router conventions with REST-style endpoints.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations** - All constitutional principles satisfied. No complexity justification required.
