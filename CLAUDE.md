# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a private birthday planner web application built as a responsive webapp for home lab deployment. The application provides a birthday calendar overview without authentication (internal network only).

**Tech Stack:**
- Next.js (frontend framework)
- ShadCN (UI components)
- JSON file storage (simple FileStore for data persistence)
- Docker containerization

**Key Architecture Decisions:**
- No authentication system (internal network access only)
- File-based JSON storage mounted as Docker volume
- Responsive design for various devices
- Docker deployment with externalized data volume

## Development Workflow (SpecKit)

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
  api/             - API routes (GET /api/birthdays)
  page.tsx         - Home page with birthday list
  layout.tsx       - Root layout
components/        - React components
  ui/              - ShadCN UI components
  birthday-card.tsx - Birthday card component
lib/               - Utility functions and services
  filestore.ts     - JSON FileStore implementation
types/             - TypeScript type definitions
data/              - JSON data storage (mounted as volume in Docker)
  birthdays.json   - Birthday data file
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
- Test data: Paula (02.10.24), Thomas (29.08.88), Isabel (12.07.90)
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

### 2025-10-28
- ✅ **001-tech-baseline**: Completed tech baseline implementation
  - Implemented birthday list display page
  - Added API endpoint GET /api/birthdays
  - Created BirthdayCard component with ShadCN UI
  - Implemented JSON FileStore with test data
  - Added Docker and Docker Compose configuration
  - Merged to develop branch
