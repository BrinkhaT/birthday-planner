# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **birthday planner web application** built as a **reference implementation for AI-assisted software development** using [SpecKit](https://github.com/specify-systems/specify). The application was primarily created by the Claude Code AI agent following a structured specification-to-implementation workflow.

The application provides a responsive birthday calendar with full CRUD operations, German localization, and Docker deployment—all designed for trusted environments without authentication.

**Tech Stack:**
- Next.js (frontend framework)
- ShadCN (UI components)
- JSON file storage (simple FileStore for data persistence)
- Docker containerization

**Key Architecture Decisions:**
- **AI-Generated**: Entire codebase created by Claude Code AI agent using SpecKit workflow
- **SpecKit-Driven**: All features follow specification → planning → implementation workflow
- **No Authentication**: Designed for trusted environments (home networks, internal tools)
- **Simple Data Storage**: File-based JSON storage (no database complexity)
- **Responsive Design**: Mobile-first with ShadCN components
- **Docker-First**: Containerized deployment with volume persistence

## Development Workflow (SpecKit)

**This project demonstrates AI-assisted software development** where Claude Code AI agent acts as the primary developer, following SpecKit's structured methodology.

### How This Project Was Built

Every feature in this application was created through an AI-driven workflow:
1. Human provides natural language feature description
2. AI agent (`/speckit.specify`) converts it to formal specification
3. AI agent (`/speckit.plan`) creates implementation plan with design artifacts
4. AI agent (`/speckit.tasks`) generates dependency-ordered task list
5. AI agent (`/speckit.implement`) writes all code, tests, and configuration
6. AI agent (`/speckit.analyze`) validates consistency across artifacts

**Result**: A production-ready application built primarily by AI, with human oversight and direction.

### SpecKit Workflow

This project uses SpecKit for structured feature development. All features must be developed following the SpecKit workflow:

### SpecKit Commands

1. `/speckit.specify` - Create or update feature specification from natural language description
2. `/speckit.plan` - Execute implementation planning workflow using the plan template
3. `/speckit.tasks` - Generate actionable, dependency-ordered tasks.md from design artifacts
4. `/speckit.analyze` - Perform cross-artifact consistency and quality analysis
5. `/speckit.clarify` - Identify underspecified areas and ask targeted clarification questions
6. `/speckit.implement` - Execute the implementation plan by processing all tasks in tasks.md
7. `/speckit.checklist` - Generate custom checklist for the current feature
8. `/speckit.constitution` - Create or update project constitution from principle inputs

### Typical Feature Development Flow

1. Start with `/speckit.specify` to create the specification
2. Use `/speckit.clarify` if requirements are unclear
3. Run `/speckit.plan` to create implementation plan
4. Execute `/speckit.tasks` to generate ordered task list
5. Review with `/speckit.analyze` for consistency
6. Implement with `/speckit.implement`

## Project Structure

```
.specify/          - SpecKit configuration and templates
  memory/          - Project constitution and principles
  templates/       - Templates for specs, plans, tasks, checklists
  scripts/         - Bash scripts for SpecKit workflows
.claude/           - Claude Code slash commands (SpecKit integration)
specs/             - Feature specifications and implementation artifacts
  001-tech-baseline/ - Tech baseline implementation (completed)
app/               - Next.js App Router application code
  api/             - API routes
    birthdays/
      route.ts     - GET /api/birthdays
      create/route.ts - POST /api/birthdays/create
      [id]/route.ts   - PUT/DELETE /api/birthdays/[id]
  page.tsx         - Home page with birthday list and CRUD operations
  layout.tsx       - Root layout
components/        - React components
  ui/              - ShadCN UI components (Dialog, Button, Card, Table, Input, Label)
  birthday-card.tsx      - Birthday card component with Edit/Delete buttons
  birthday-table.tsx     - Birthday table component with Edit/Delete buttons
  birthday-form.tsx      - Form for add/edit with German validation
  birthday-modal.tsx     - Modal wrapper for add/edit operations
  delete-confirmation.tsx - Delete confirmation dialog
lib/               - Utility functions and services
  filestore.ts     - JSON FileStore implementation (read/write operations)
  validations.ts   - Form validation and date format conversion
  date-utils.ts    - Date parsing and birthday calculations
  i18n-de.ts       - German localization strings
  utils.ts         - Utility functions
types/             - TypeScript type definitions
  birthday.ts      - Birthday type definitions
data/              - JSON data storage (mounted as volume in Docker)
  birthdays.json   - Birthday data file (ISO format internally)
```

## Current Implementation Status

### Completed Features

**Tech Baseline (001-tech-baseline)** - COMPLETED ✅
- Next.js 16 with App Router and TypeScript
- React 19 with modern hooks
- ShadCN UI components with Tailwind CSS
- Birthday list display with responsive design (320px-1920px)
- API endpoint: GET /api/birthdays
- JSON FileStore with test data (Paula, Thomas, Isabel)
- Docker configuration with multi-stage build
- Docker Compose setup with volume persistence

**Split Birthday View (002-split-birthday-view)** - COMPLETED ✅
- Split view: "Anstehende Geburtstage" (next 30 days) + "Alle weiteren Geburtstage" (rest)
- Card view for upcoming birthdays (grid layout)
- Table view for all other birthdays (sortable by date)
- Age calculation with German localization
- Date format handling: DD.MM. (without year) and DD.MM.YYYY (with year)
- ISO 8601 format for internal storage (YYYY-MM-DD, --MM-DD)

**Birthday CRUD Operations (003-crud-operations)** - COMPLETED ✅
- **Create**: Add new birthday entries via modal dialog with form validation
- **Read**: View birthdays in card and table views (from 002-split-birthday-view)
- **Update**: Edit existing birthdays with pre-filled form and German date format
- **Delete**: Delete birthdays with mandatory confirmation dialog
- API endpoints: POST /api/birthdays/create, PUT /api/birthdays/[id], DELETE /api/birthdays/[id]
- German form validation and error messages
- Optimistic UI updates for instant feedback
- Date format conversion: ISO (storage) ↔ German (display)
- Mobile-friendly with 44x44px tap targets

### Running the Application

**Development:**
```bash
npm run dev
# Opens at http://localhost:3000
```

**Production (Docker):**
```bash
docker-compose up -d
# Application available at http://localhost:3000
```

## Docker Deployment

The application runs as a Docker container with:
- Multi-stage build (build + production stages)
- Node.js Alpine base image for minimal footprint
- Externalized volume mount for JSON FileStore at `/data`
- Internal network access only (no public exposure)
- Home lab deployment target
- Port 3000 exposed for web access

## Data Storage

Birthday data is persisted in JSON FileStore:
- Location: `data/birthdays.json` (mounted to `/data` in Docker)
- Simple JSON structure with version field
- Atomic read/write operations
- **Internal format**: ISO 8601 (YYYY-MM-DD for full dates, --MM-DD for dates without year)
- **Display format**: German (DD.MM.YYYY for full dates, DD.MM. for dates without year)
- Bidirectional conversion between ISO and German formats
- No database required

## Active Technologies
- TypeScript 5.9+, Next.js 16 with App Router, React 19 + ShadCN UI components, Tailwind CSS, Lucide React icons (002-split-birthday-view)
- JSON FileStore (existing - no changes required) (002-split-birthday-view)
- TypeScript 5.9+, Node.js 20.x + Next.js 16 (App Router), React 19, ShadCN UI components, Lucide React (icons), Tailwind CSS (003-crud-operations)
- JSON FileStore (file-based persistence at /data/birthdays.json) (003-crud-operations)

**Frontend Stack:**
- TypeScript 5.9+
- Next.js 16 with App Router
- React 19 with modern hooks
- ShadCN UI components
- Tailwind CSS for styling
- Lucide React for icons

**Data Layer:**
- JSON FileStore (no database)
- File-based persistence with atomic operations

**Deployment:**
- Docker with multi-stage builds
- Docker Compose for orchestration
- Node.js Alpine base image

## Recent Changes

### 2025-10-29
- ✅ **003-crud-operations**: Completed full CRUD operations
  - Implemented Add Birthday feature with modal dialog and form validation
  - Implemented Edit Birthday feature with pre-filled form and date conversion
  - Implemented Delete Birthday feature with confirmation dialog
  - Added API endpoints: POST /api/birthdays/create, PUT/DELETE /api/birthdays/[id]
  - German form validation and error messages throughout
  - Optimistic UI updates for instant feedback
  - Date format handling: ISO 8601 (storage) ↔ German format (display)
  - Mobile-friendly with 44x44px tap targets for accessibility
  - Tested in development and Docker deployment

### 2025-10-28
- ✅ **002-split-birthday-view**: Completed split birthday view feature
  - Split view into "Anstehende Geburtstage" (next 30 days) and "Alle weiteren Geburtstage"
  - Card view for upcoming birthdays (responsive grid)
  - Table view for all other birthdays (sortable)
  - Age calculation with German localization
  - Date format support: DD.MM. (without year) and DD.MM.YYYY (with year)
  - Merged to develop branch
- ✅ **001-tech-baseline**: Completed tech baseline implementation
  - Implemented birthday list display page
  - Added API endpoint GET /api/birthdays
  - Created BirthdayCard component with ShadCN UI
  - Implemented JSON FileStore with test data
  - Added Docker and Docker Compose configuration
  - Merged to develop branch
