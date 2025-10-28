<!--
Sync Impact Report:
Version Change: 1.1.0 → 1.1.1
Change Type: PATCH - Clarified German Localization principle to explicitly include all UI text
Modified Principles:
  - Principle VI: German Localization - Expanded to emphasize ALL frontend text must be German
Added Sections: None
Removed Sections: None
Templates Status:
  ✅ plan-template.md - Constitution check already validates German formatting
  ✅ spec-template.md - Acceptance scenarios already verify German formats
  ✅ tasks-template.md - Tasks already implement German formatting
  ✅ Implementation complete - All frontend texts translated (app/page.tsx, birthday-table.tsx, birthday-card.tsx, layout.tsx)
Follow-up TODOs: None - all frontend texts already implemented in German
-->

# Birthday Planner Constitution

## Core Principles

### I. SpecKit-Driven Development

All features MUST follow the SpecKit workflow without exception:
- Feature development begins with `/speckit.specify` to create specification
- Use `/speckit.clarify` when requirements are unclear or underspecified
- Execute `/speckit.plan` to generate implementation planning artifacts
- Generate tasks with `/speckit.tasks` before implementation begins
- Implement features using `/speckit.implement` to process task lists
- Validate consistency with `/speckit.analyze` across artifacts

**Rationale**: SpecKit ensures structured, documented, and traceable feature development
with clear specifications, plans, and tasks before implementation begins.

### II. Simplicity First

Features MUST start with the simplest viable approach:
- JSON file storage before considering databases
- Direct implementation before abstractions
- File-based configuration before complex management systems
- Avoid premature optimization or over-engineering
- YAGNI (You Aren't Gonna Need It) principles strictly enforced

**Rationale**: As a private home lab project, simplicity reduces maintenance burden
and accelerates delivery. Complexity must be justified with concrete requirements.

### III. Responsive Design

All user interfaces MUST be responsive and mobile-friendly:
- Mobile-first design approach
- Support for tablet and desktop viewports
- Touch-friendly interaction patterns
- Readable typography across all screen sizes
- ShadCN components MUST be used consistently for UI implementation

**Rationale**: Birthday calendar must be accessible from any device on home network,
including phones, tablets, and desktop browsers.

### IV. Docker-First Deployment

The application MUST be containerized and deployment-ready:
- Dockerfile maintained and functional at all times
- Data persistence via volume mounts (JSON FileStore externalized)
- Configuration via environment variables where appropriate
- Docker image buildable without external dependencies beyond base images
- Container must be runnable in home lab environment (internal network only)

**Rationale**: Docker ensures consistent deployment, easy updates, and proper
data separation in home lab infrastructure.

### V. No Authentication Required

The application MUST NOT implement authentication mechanisms:
- Direct access to all features without login
- No user management system
- No password storage or session handling
- Security relies on network isolation (internal network only)
- Consider this principle NON-NEGOTIABLE for initial versions

**Rationale**: Application runs on internal home network only. Authentication
adds unnecessary complexity for private, trusted network deployment.

### VI. German Localization

ALL user-facing content MUST be in German language with German formatting conventions:

**Language Requirements**:
- **ALL UI Text**: Headings, labels, buttons, messages, tooltips in German
- **Error Messages**: All error and status messages in German
- **Empty States**: All placeholder and empty state messages in German
- **Metadata**: Page titles, descriptions, and meta tags in German
- **HTML Attributes**: `lang="de"` attribute on root HTML element

**Formatting Requirements**:
- **Dates**: DD.MM.YYYY format (e.g., "28.10.2025" not "10/28/2025" or "2025-10-28")
- **Times**: 24-hour format with colon separator (e.g., "14:30" not "2:30 PM")
- **Numbers**: German decimal notation with comma for decimals and period for thousands
  (e.g., "1.234,56" not "1,234.56")
- **Day/Month names**: German names (e.g., "Januar" not "January", "Montag" not "Monday")
- **Locale Setting**: Use `de-DE` locale for all date/number formatting functions

**Examples of Required German Text**:
- "Geburtstagplaner" not "Birthday Planner"
- "Geburtstage werden geladen..." not "Loading birthdays..."
- "Fehler beim Laden" not "Error loading"
- "Anstehende Geburtstage" not "Upcoming Birthdays"
- "Keine Geburtstage vorhanden" not "No birthdays found"

**Rationale**: Application is deployed in German-speaking household. Complete German
localization (both language and formatting) provides intuitive user experience and
eliminates confusion with international date/number formats and English terminology.

## Technology Stack Requirements

### Mandatory Technologies

- **Frontend Framework**: Next.js (latest stable version)
- **UI Components**: ShadCN component library
- **Data Storage**: JSON file storage (FileStore pattern)
- **Containerization**: Docker
- **Deployment Target**: Home lab internal network
- **Localization**: German locale (de-DE) for all formatting and German language for all text

### Prohibited Technologies (Initial Version)

- Database systems (PostgreSQL, MySQL, MongoDB, etc.)
- Authentication libraries or frameworks
- External API dependencies requiring internet access
- Server-side rendering requiring external services

**Rationale**: Keep the technology stack minimal, maintainable, and suitable
for offline home lab deployment without external dependencies.

## Development Workflow

### Feature Development Process

1. **Specification Phase**: Use `/speckit.specify` to document feature requirements
2. **Clarification Phase**: Run `/speckit.clarify` if specifications have gaps
3. **Planning Phase**: Execute `/speckit.plan` to create implementation plan
4. **Task Generation**: Generate ordered tasks with `/speckit.tasks`
5. **Analysis Phase**: Validate with `/speckit.analyze` before implementation
6. **Implementation Phase**: Execute `/speckit.implement` to complete tasks
7. **Validation**: Test feature independently before integration

### Incremental Delivery

Features MUST be delivered incrementally with independent user stories:
- Each user story must be independently testable
- User stories prioritized (P1, P2, P3, etc.)
- MVP delivered with P1 user story only
- Subsequent stories add value without breaking previous functionality
- Stop and validate after each user story completion

**Rationale**: Incremental delivery allows early validation and reduces risk of
building unnecessary features or wrong implementations.

### Documentation Standards

All features MUST maintain documentation in specs/ directory:
- `spec.md` - Feature specification with user stories
- `plan.md` - Implementation plan with technical decisions
- `tasks.md` - Ordered task list for implementation
- Additional artifacts as generated by SpecKit workflow

## Data Management

### FileStore Requirements

Birthday data MUST be persisted as JSON files:
- Simple, readable JSON structure
- One file per logical entity or collection
- Atomic write operations to prevent corruption
- Backup-friendly format (plain text, version control compatible)
- Volume mounted at `/data` in Docker container

### Data Schema

Data files MUST include:
- Schema version field for future migrations
- Timestamp fields for creation and modification (ISO-8601 format internally)
- Unique identifiers for each record
- Validation-friendly structure
- Date fields stored in German DD.MM.YYYY format or DD.MM format

**Rationale**: JSON FileStore provides simplicity, readability, backup ease,
and sufficient performance for private birthday calendar use case.

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines.
All feature specifications, implementation plans, and code reviews MUST
verify compliance with constitutional principles.

### Amendment Process

Constitutional amendments require:
1. Documented justification for the change
2. Version bump following semantic versioning (MAJOR.MINOR.PATCH)
3. Update to affected SpecKit templates and documentation
4. Sync Impact Report documenting all changes

### Complexity Justification

Any violation of constitutional principles MUST be justified in the
implementation plan's "Complexity Tracking" section, documenting:
- Which principle is being violated
- Why the violation is necessary
- What simpler alternatives were considered and rejected

### Version Control

- Constitution versioning follows semantic versioning
- MAJOR: Backward-incompatible principle changes or removals
- MINOR: New principles added or material guidance expansions
- PATCH: Clarifications, wording improvements, non-semantic fixes

**Version**: 1.1.1 | **Ratified**: 2025-10-28 | **Last Amended**: 2025-10-28
