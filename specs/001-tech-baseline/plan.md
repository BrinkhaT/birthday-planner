# Implementation Plan: Tech Baseline - Birthday List Display

**Branch**: `001-tech-baseline` | **Date**: 2025-10-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-tech-baseline/spec.md`

## Summary

This feature establishes the technical baseline for the Birthday Planner application. It creates a single-page, mobile-first web application that displays a list of upcoming birthdays. The application uses Next.js for the frontend, fetches data from an API endpoint, and stores birthday data in JSON files. The system will initialize with three test birthdays and demonstrate the complete tech stack working end-to-end.

## Technical Context

**Language/Version**: TypeScript with Next.js 14+ (App Router)
**Primary Dependencies**: Next.js, React, ShadCN UI components, Tailwind CSS
**Storage**: JSON file storage (FileStore pattern, no database)
**Testing**: Vitest or Jest for unit tests (optional for baseline)
**Target Platform**: Docker container for home lab deployment (Linux)
**Project Type**: Web application (Next.js full-stack)
**Performance Goals**: Page load under 2 seconds, responsive across 320px-1920px viewports
**Constraints**: No authentication, internal network only, offline-capable, simple JSON storage
**Scale/Scope**: Single user, 3 initial birthdays, single page, MVP baseline feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. SpecKit-Driven Development ✅
- Following SpecKit workflow: `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`
- Specification completed and validated
- Plan being generated with research and design artifacts

### II. Simplicity First ✅
- Using JSON file storage (simplest approach)
- No database system
- Direct API implementation without abstractions
- Single page application for baseline
- Minimal dependencies (Next.js + ShadCN + Tailwind)

### III. Responsive Design ✅
- Mobile-first approach required (spec FR-005)
- Support for 320px-1920px viewports (spec SC-002, SC-003)
- Using ShadCN components for consistent UI
- Responsive layout requirements in acceptance scenarios

### IV. Docker-First Deployment ✅
- Dockerfile will be created in Phase 1
- JSON data volume mount at `/data`
- Environment variables for configuration
- Home lab deployment target specified

### V. No Authentication Required ✅
- No authentication mechanisms (per constitution principle V)
- Direct access to all features
- Internal network deployment only

### Technology Stack Compliance ✅
- **Frontend Framework**: Next.js ✅
- **UI Components**: ShadCN ✅
- **Data Storage**: JSON FileStore ✅
- **Containerization**: Docker ✅
- **No prohibited technologies**: No database, no auth, no external APIs ✅

**Gate Status**: ✅ PASSED - All constitutional requirements met

## Project Structure

### Documentation (this feature)

```text
specs/001-tech-baseline/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── api.yaml         # OpenAPI specification for birthday API
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
birthday-planner-speckit/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (birthday list)
│   └── api/                 # API routes
│       └── birthdays/
│           └── route.ts     # GET /api/birthdays
├── components/              # React components
│   └── ui/                  # ShadCN UI components
│       └── card.tsx         # Birthday card component
├── lib/                     # Utility functions
│   ├── filestore.ts         # JSON file storage operations
│   └── utils.ts             # Helper functions
├── data/                    # JSON data directory
│   └── birthdays.json       # Birthday data file
├── public/                  # Static assets
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose for local dev
├── package.json             # Node.js dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── next.config.js           # Next.js configuration
└── .env.local               # Environment variables (local)
```

**Structure Decision**: Web application structure with Next.js App Router. Frontend and backend (API routes) are integrated in a single Next.js application, following the "Option 2: Web application" pattern but simplified since Next.js provides both frontend and backend in one codebase. The `/data` directory will be volume-mounted in Docker.

## Complexity Tracking

> No constitutional violations - all principles adhered to.

This baseline feature requires no complexity justification as it follows all constitutional principles without exception.

---

## Post-Design Constitution Re-Check

*Re-evaluation after Phase 1 design artifacts completed*

### Design Artifacts Completed ✅

- ✅ research.md - Technical decisions documented
- ✅ data-model.md - Birthday entity and JSON schema defined
- ✅ contracts/api.yaml - OpenAPI specification for GET /api/birthdays
- ✅ quickstart.md - Setup and validation guide
- ✅ CLAUDE.md updated with tech stack

### Constitution Compliance Re-Verification ✅

**I. SpecKit-Driven Development** ✅
- All artifacts generated following SpecKit workflow
- Documentation complete and consistent
- Ready for `/speckit.tasks` phase

**II. Simplicity First** ✅
- JSON FileStore implementation confirmed (research.md)
- No database dependencies
- Minimal abstractions in design
- Direct file operations with Node.js fs module

**III. Responsive Design** ✅
- Mobile-first approach documented (research.md)
- Tailwind CSS breakpoints defined
- ShadCN responsive components specified
- Quickstart includes responsive validation checklist

**IV. Docker-First Deployment** ✅
- Dockerfile pattern documented (research.md)
- Multi-stage build with Alpine base
- Volume mount for `/data` directory specified
- Docker Compose setup included in quickstart

**V. No Authentication Required** ✅
- No authentication in design
- Direct API access confirmed
- No user management components

**Technology Stack Compliance** ✅
- Next.js 14+ App Router confirmed
- ShadCN UI components specified
- TypeScript throughout
- JSON FileStore pattern implemented
- Docker containerization designed
- No prohibited technologies introduced

**Final Gate Status**: ✅ PASSED - All constitutional requirements maintained through design phase

---

## Planning Phase Complete

**Status**: Ready for task generation (`/speckit.tasks`)

**Artifacts Generated**:
1. ✅ plan.md - This implementation plan
2. ✅ research.md - Technical research and decisions
3. ✅ data-model.md - Birthday entity and storage schema
4. ✅ contracts/api.yaml - OpenAPI specification
5. ✅ quickstart.md - Setup and validation guide
6. ✅ CLAUDE.md - Updated with tech stack information

**Next Step**: Run `/speckit.tasks` to generate dependency-ordered task list for implementation.
