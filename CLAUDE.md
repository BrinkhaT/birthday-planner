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
```

## Docker Deployment

The application will run as a Docker container with:
- Externalized volume mount for JSON FileStore
- Internal network access only (no public exposure)
- Home lab deployment target

## Data Storage

Birthday data is persisted as JSON files in a FileStore:
- Simple JSON file structure
- Mounted as Docker volume for persistence
- No database required for initial version
