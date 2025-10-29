# Changelog

## [1.0.0](https://github.com/brinkhat/birthday-planner-speckit/compare/v0.0.0...v1.0.0) (2025-10-29)

### Features

* **tech-baseline:** Next.js 16 app with birthday list display ([001-tech-baseline](specs/001-tech-baseline))
  - Next.js 16 App Router with TypeScript 5.9+
  - ShadCN UI components with Tailwind CSS
  - Birthday list display with responsive design (320px-1920px)
  - API endpoint: GET /api/birthdays
  - JSON FileStore with test data
  - Docker configuration with multi-stage build

* **split-view:** Split birthday view by upcoming vs. future ([002-split-birthday-view](specs/002-split-birthday-view))
  - Split view: "Anstehende Geburtstage" (next 30 days) + "Alle weiteren Geburtstage" (rest)
  - Card view for upcoming birthdays (responsive grid)
  - Table view for all other birthdays (sortable by date)
  - Age calculation with German localization
  - Date format handling: DD.MM. and DD.MM.YYYY

* **crud-operations:** Full CRUD operations for birthdays ([003-crud-operations](specs/003-crud-operations))
  - Create: Add new birthday entries via modal dialog with validation
  - Read: View birthdays in card and table views
  - Update: Edit existing birthdays with pre-filled form
  - Delete: Delete birthdays with mandatory confirmation dialog
  - API endpoints: POST /api/birthdays/create, PUT/DELETE /api/birthdays/[id]
  - German form validation and error messages
  - Optimistic UI updates
  - Date format conversion: ISO (storage) ↔ German (display)

### Build System

* **docker:** Multi-stage Docker build with Alpine base
  - Build stage: npm ci + npm run build
  - Production stage: Next.js standalone output
  - Volume mount at /data for JSON FileStore
  - Docker Compose with named volumes
  - Port 3000 exposed

### Documentation

* **constitution:** Established Birthday Planner Constitution v1.0.0
  - SpecKit-Driven Development (mandatory workflow)
  - Simplicity First (JSON storage, YAGNI)
  - Responsive Design (mobile-first with ShadCN)
  - Docker-First Deployment
  - No Authentication Required (internal network only)

* **readme:** Comprehensive documentation
  - Feature overview and benefits
  - Development and Docker deployment instructions
  - API documentation
  - Data format specifications

### Continuous Integration

* **github-actions:** Develop branch CI/CD pipeline
  - Lint: ESLint validation
  - Build: Next.js production build
  - Docker: Multi-stage build and push to Docker Hub (develop tag)

### Miscellaneous Chores

* **eslint:** Migrate to ESLint 9 flat config
  - Remove .eslintrc.json and .eslintignore
  - Add eslint.config.mjs
  - Fix all TypeScript ESLint errors
  - Add eslint-config-prettier

### Initial Release

This is the first stable release of the Birthday Planner. The application is production-ready with:
- Full CRUD operations for birthday management
- Docker deployment support
- CI/CD pipeline for automated builds
- Comprehensive documentation
- German localization
