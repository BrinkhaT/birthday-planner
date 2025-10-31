<!--
Sync Impact Report:
Version Change: 2.0.0 → 2.1.0
Change Type: MINOR - New principle added (testing infrastructure requirements)

Modified Principles: None

Added Sections:
  - Principle VII: "Comprehensive Testing Infrastructure"
    - Rationale: Codifies testing standards and infrastructure implemented in feature 005-comprehensive-testing
    - Requirements: Jest 29.x, 80%+ global coverage, <10s execution, organized test structure
    - Impact: All future features must include comprehensive tests following established patterns

Removed Sections: None

Templates Status:
  ✅ plan-template.md - Constitution check already validates testing requirements
  ✅ spec-template.md - Acceptance scenarios support test criteria
  ✅ tasks-template.md - Task structure includes test phases
  ✅ Implementation complete - Feature 005-comprehensive-testing established testing infrastructure

Follow-up TODOs: None - all templates align with new testing principle
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

### V. Optional Authentication

The application MUST support both trusted-network and secured deployment modes:

**Default Mode (No Authentication)**:
- Direct access to all features without login or credentials
- No user management system required
- No password storage or session handling
- Security relies on network isolation (internal network only)
- MUST remain the default behavior to preserve simplicity

**Optional BasicAuth Mode**:
- MAY be enabled via environment variable (ENABLE_BASICAUTH=true)
- MUST use HTTP Basic Authentication (RFC 7617) when enabled
- MUST validate credentials with timing-attack resistant comparison
- MUST fail-fast at startup if credentials missing when enabled
- MUST provide German-language error messages and prompts
- MUST have zero performance overhead when disabled (early-return architecture)

**Security Requirements When Enabled**:
- Constant-time credential comparison to prevent timing attacks
- Fail-fast validation: Application MUST NOT start with misconfigured credentials
- Strong password requirements documented in deployment guide
- HTTPS strongly recommended for production (documented warning)

**Rationale**: Application primarily runs on trusted internal home networks where
authentication adds unnecessary complexity. Optional BasicAuth allows security
hardening for edge cases (internet-exposed deployments, shared networks) while
maintaining simplicity as the default.

### VI. German Localization

ALL user-facing content MUST be in German language with German formatting conventions:

**Language Requirements**:
- **ALL UI Text**: Headings, labels, buttons, messages, tooltips in German
- **Error Messages**: All error and status messages in German (including auth errors)
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
- "Authentifizierung erforderlich" not "Authentication required" (BasicAuth)

**Rationale**: Application is deployed in German-speaking household. Complete German
localization (both language and formatting) provides intuitive user experience and
eliminates confusion with international date/number formats and English terminology.

### VII. Comprehensive Testing Infrastructure

All application logic MUST be covered by automated tests following established patterns:

**Test Framework Requirements**:
- **Framework**: Jest 29.x with React Testing Library 16.x
- **Configuration**: Next.js preset with SWC transforms for fast execution
- **Execution Speed**: Full test suite MUST execute in < 10 seconds
- **Zero Failures**: All tests must pass before merging to main branches

**Test Organization**:
- **Unit Tests** (`__tests__/unit/`): Pure functions and isolated logic (90-100% coverage target)
  - lib/ modules (date-utils, validations, filestore)
  - Isolated React hooks and state management
- **Integration Tests** (`__tests__/integration/`): API routes and component interactions (100% coverage target)
  - All API endpoints (GET, POST, PUT, DELETE)
  - Success and error scenarios
- **Test Fixtures** (`__tests__/fixtures/`): Reusable test data (birthdays, dates, validation cases)
- **Test Mocks** (`__tests__/mocks/`, `__mocks__/`): Mock utilities for fs, fetch, Next.js APIs

**Coverage Requirements**:
- **Global Minimum**: 80% statements, 80% branches, 80% functions
- **Critical Modules**: 100% coverage for core business logic (date-utils, validations)
- **API Routes**: 100% coverage including all error paths
- **FileStore**: 90%+ coverage for file operations and atomic writes
- **Frontend Hooks**: 80%+ coverage for state management logic

**Testing Standards**:
- **Naming**: `<source-file>.test.ts` or `<source-file>.test.tsx` mirroring source structure
- **Descriptions**: Given/When/Then style with behavior-focused test names
- **Deterministic**: Use reference dates from fixtures, never `new Date()` directly
- **Isolated**: Clone fixtures before mutation (`structuredClone()`), clear mocks between tests
- **German Localization**: Validate error messages match `i18n-de.ts` strings
- **Documentation**: Maintain `__tests__/README.md` with testing patterns and best practices

**Test Execution**:
- **Local Development**: `npm test` for all tests, `npm test -- --watch` for watch mode
- **Coverage Reports**: `npm test -- --coverage` generates HTML reports in `coverage/lcov-report/`
- **CI Integration**: `npm test:ci` for continuous integration with coverage enforcement

**Prohibited Practices**:
- ❌ Testing implementation details (test behavior, not internals)
- ❌ Shared state between tests (causes flakiness)
- ❌ Non-deterministic tests (random data, current time without mocking)
- ❌ Committing `.only()` or `.skip()` to version control
- ❌ Slow tests (> 1 second per test file indicates mocking issues)

**Rationale**: Comprehensive automated testing ensures code quality, prevents regressions,
validates business logic correctness (especially date calculations and German formatting),
and enables confident refactoring. The established testing infrastructure provides patterns
and utilities for efficient test authoring while maintaining fast execution times.

## Technology Stack Requirements

### Mandatory Technologies

- **Frontend Framework**: Next.js (latest stable version)
- **UI Components**: ShadCN component library
- **Data Storage**: JSON file storage (FileStore pattern)
- **Containerization**: Docker
- **Testing**: Jest 29.x with React Testing Library 16.x
- **Deployment Target**: Home lab internal network (optionally internet-exposed with BasicAuth)
- **Localization**: German locale (de-DE) for all formatting and German language for all text

### Prohibited Technologies (Initial Version)

- Database systems (PostgreSQL, MySQL, MongoDB, etc.)
- Complex authentication frameworks (OAuth, JWT, session management)
- External API dependencies requiring internet access
- Server-side rendering requiring external services

**Note on BasicAuth**: HTTP Basic Authentication is permitted as an OPTIONAL security
layer (environment-variable controlled) because it meets simplicity requirements:
- Zero external dependencies (Node.js built-ins only)
- No config files or complex setup
- Stateless (no session management)
- Standards-compliant (RFC 7617)

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
7. **Testing Phase**: Write comprehensive tests following established patterns
8. **Validation**: Verify tests pass and coverage meets thresholds before integration

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
- Date fields stored in ISO-8601 format internally, displayed in German DD.MM.YYYY or DD.MM. format

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

**Version**: 2.1.0 | **Ratified**: 2025-10-28 | **Last Amended**: 2025-10-30
