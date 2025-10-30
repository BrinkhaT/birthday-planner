# Implementation Plan: Optional BasicAuth Protection

**Branch**: `004-basicauth-env` | **Date**: 2025-10-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-basicauth-env/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature adds optional HTTP Basic Authentication protection to the birthday planner application via environment variables. When enabled, all pages and API endpoints require authentication. When disabled (default), the application behaves identically to the current version with no authentication. This allows administrators to secure the application when deployed outside trusted home networks while maintaining simplicity for internal deployments.

## Technical Context

**Language/Version**: TypeScript 5.9+, Node.js 20.x, Next.js 16 (App Router)
**Primary Dependencies**: Next.js built-in middleware system, Node.js Buffer API for Base64 decoding
**Storage**: N/A (no data storage changes - authentication state managed by browser)
**Testing**: Manual testing in development and Docker environments
**Target Platform**: Docker container (Linux Alpine), accessible via web browser
**Project Type**: Web application (Next.js App Router with API routes)
**Performance Goals**: Zero performance overhead when disabled, <5ms authentication check overhead when enabled
**Constraints**: Must not break existing functionality, must work in Docker with environment variables
**Scale/Scope**: Affects all pages (currently 1 page) and all API endpoints (currently 4 endpoints)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: SpecKit-Driven Development ✅
- Feature follows SpecKit workflow: `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`
- Specification complete with all clarifications resolved

### Principle II: Simplicity First ✅
- Uses Next.js built-in middleware (no external auth libraries)
- Environment variable configuration (no config files or databases)
- Standard HTTP Basic Auth (RFC 7617 - widely supported, simple protocol)
- No session management, no token storage, no user database
- Browser handles credential caching automatically

### Principle III: Responsive Design ✅
- No UI changes required
- Browser's native BasicAuth dialog is responsive by default
- Existing mobile-friendly pages remain unchanged

### Principle IV: Docker-First Deployment ✅
- Configuration via environment variables in docker-compose.yml
- No changes to volume mounts or data persistence
- Dockerfile remains simple with no additional dependencies

### Principle V: No Authentication Required ⚠️ VIOLATION (JUSTIFIED)
**Violation**: This feature explicitly adds authentication capability
**Justification**:
- Authentication is **optional** and **disabled by default**
- Maintains backward compatibility - existing deployments unaffected
- Enables safe deployment outside trusted home network (VPN access, DMZ, cloud hosting)
- Addresses real security need for expanded deployment scenarios
- Fail-fast approach (startup error if misconfigured) prevents accidental security bypass
**Simpler Alternative Rejected**: Network-level security (firewall, VPN) alone may not be sufficient for all deployment scenarios (e.g., sharing with family members who need remote access but shouldn't expose to entire internet)

### Principle VI: German Localization ⚠️ PARTIAL COMPLIANCE
- HTTP 401 status response will include German `WWW-Authenticate` realm message
- Browser's BasicAuth dialog is controlled by browser/OS locale (not customizable)
- Startup error messages for missing credentials will be in German in application logs
**Note**: Native browser authentication dialogs cannot be fully localized by the application

### Technology Stack Requirements ✅
- Next.js middleware (built-in feature, no external dependencies)
- Environment variables (standard Docker practice)
- No database or authentication framework added

## Project Structure

### Documentation (this feature)

```text
specs/004-basicauth-env/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

Note: No `data-model.md` needed (no data entities). No `contracts/` needed (no API changes - only adds authentication layer).

### Source Code (repository root)

```text
# Next.js App Router structure (existing)
app/
├── api/
│   └── birthdays/
│       ├── route.ts           # GET /api/birthdays (protect with auth)
│       ├── create/
│       │   └── route.ts       # POST /api/birthdays/create (protect with auth)
│       └── [id]/
│           └── route.ts       # PUT/DELETE /api/birthdays/[id] (protect with auth)
├── page.tsx                   # Home page (protect with auth)
└── layout.tsx                 # Root layout (no changes)

# NEW FILES
middleware.ts                  # Next.js Edge Middleware for BasicAuth (NEW)
lib/
└── auth.ts                    # Auth utilities and config validation (NEW)

# MODIFIED FILES
docker-compose.yml             # Add ENABLE_BASICAUTH, BASICAUTH_USERNAME, BASICAUTH_PASSWORD env vars
Dockerfile                     # No changes needed (env vars passed at runtime)
```

**Structure Decision**: Use Next.js Edge Middleware at root level (`middleware.ts`) to intercept all requests and check BasicAuth credentials when enabled. This provides centralized authentication logic that protects both pages and API routes without modifying each endpoint individually.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principle V: No Authentication Required | Enable secure deployment outside trusted home network (VPN access, remote family access, DMZ hosting) | Network-level security alone (firewall/VPN) doesn't address scenarios where remote access is needed for specific users without exposing to entire internet. BasicAuth provides simple application-level control that complements network security. |

## Phase 0: Research & Technical Decisions

See [research.md](./research.md) for detailed technical decisions and alternatives analysis.

Key decisions to be documented in research.md:
1. Next.js middleware implementation approach (Edge vs. Node.js runtime)
2. Base64 credential decoding and comparison strategy
3. Environment variable validation and error handling at startup
4. HTTP 401 response format and WWW-Authenticate header configuration
5. German error message approach for startup failures

## Phase 1: Design Artifacts

### Data Model

**Not applicable** - This feature operates at the infrastructure/middleware level and does not introduce new data entities or modify existing Birthday entities.

### API Contracts

**Not applicable** - This feature does not modify existing API endpoints or add new ones. It adds an authentication layer that protects existing endpoints with HTTP 401 responses when credentials are missing or invalid.

**Behavior changes**:
- All API routes return HTTP 401 Unauthorized (with `WWW-Authenticate` header) when BasicAuth is enabled and credentials are missing/invalid
- Existing 200/201/204/400/404/500 responses remain unchanged when properly authenticated

### Quickstart Guide

See [quickstart.md](./quickstart.md) for setup and testing instructions.

---

## Phase 2: Constitution Check Re-evaluation

*Re-evaluated after completing Phase 0 research and Phase 1 design artifacts*

### Principle I: SpecKit-Driven Development ✅
- ✅ Specification complete (spec.md)
- ✅ Planning complete (plan.md)
- ✅ Research complete (research.md)
- ✅ Quickstart guide complete (quickstart.md)
- ✅ Ready for `/speckit.tasks` to generate task list
- ✅ Will use `/speckit.implement` for implementation

### Principle II: Simplicity First ✅
**Design Review**:
- ✅ Single middleware.ts file (~50 lines) provides all authentication
- ✅ Single lib/auth.ts utility file for validation logic
- ✅ Single instrumentation.ts file for startup validation
- ✅ Zero external dependencies (uses Node.js built-ins only)
- ✅ No database, no session storage, no complex state management
- ✅ Environment variables only - no config files
**Conclusion**: Design maintains maximum simplicity

### Principle III: Responsive Design ✅
**Design Review**:
- ✅ No UI changes required
- ✅ Browser's native BasicAuth dialog is responsive by default
- ✅ Existing mobile-friendly pages completely unchanged
- ✅ Authentication transparent to UI layer
**Conclusion**: Zero impact on responsive design

### Principle IV: Docker-First Deployment ✅
**Design Review**:
- ✅ Environment variables added to docker-compose.yml (3 new vars)
- ✅ No Dockerfile changes required (env vars passed at runtime)
- ✅ No volume mount changes
- ✅ No additional containers or services
- ✅ Startup validation ensures correct configuration before server starts
**Conclusion**: Docker deployment remains simple and clean

### Principle V: No Authentication Required ⚠️ VIOLATION (JUSTIFIED)
**Design Review**:
- ⚠️ Adds optional authentication capability (intentional violation)
- ✅ Default behavior unchanged (disabled by default)
- ✅ Backward compatible (existing deployments unaffected)
- ✅ Fail-fast prevents misconfiguration security holes
- ✅ Enables expanded deployment scenarios (VPN, remote access, DMZ)
**Conclusion**: Violation justified and properly documented in Complexity Tracking

### Principle VI: German Localization ✅ (with noted limitations)
**Design Review**:
- ✅ WWW-Authenticate realm in German: `"Geburtstagplaner"`
- ✅ Startup error messages in German console output
- ✅ Status messages in German (`aktiviert`, `deaktiviert`)
- ⚠️ Browser's auth dialog language controlled by browser/OS (non-customizable limitation)
**Conclusion**: Compliant within technical constraints of HTTP Basic Auth

### Technology Stack Requirements ✅
**Design Review**:
- ✅ Next.js middleware (built-in feature)
- ✅ Node.js Buffer API (built-in)
- ✅ No database added
- ✅ No authentication frameworks added
- ✅ No external dependencies added
**Conclusion**: Technology stack remains minimal and compliant

---

## Final Design Summary

### Files to Create (3 new files)
1. **middleware.ts** - Edge middleware for BasicAuth checks
2. **lib/auth.ts** - Authentication utilities and validation
3. **instrumentation.ts** - Startup validation for credentials

### Files to Modify (1 file)
1. **docker-compose.yml** - Add 3 environment variables

### No Changes Required
- ✅ Dockerfile (env vars passed at runtime)
- ✅ All app/ components and pages (authentication transparent)
- ✅ All API routes (protected by middleware automatically)
- ✅ Data storage (no changes to birthdays.json or FileStore)

### Lines of Code Estimate
- middleware.ts: ~50 lines
- lib/auth.ts: ~30 lines
- instrumentation.ts: ~25 lines
- docker-compose.yml: +3 lines
**Total**: ~108 lines of new code

### Complexity Assessment
**Cyclomatic Complexity**: Low
- Simple boolean checks (enabled/disabled)
- Single authentication path (BasicAuth only)
- No branches for different auth methods
- No complex state management

**Maintainability**: High
- Centralized in 3 small files
- Clear separation of concerns
- Well-documented in research.md and quickstart.md
- Standard HTTP protocol (RFC 7617)

**Risk Assessment**: Low
- Non-breaking change (disabled by default)
- Fail-fast prevents misconfiguration
- Standard browser behavior (no custom UI)
- No data migration required

---

## Ready for Task Generation

✅ All planning phases complete
✅ All design artifacts generated
✅ Constitution compliance verified
✅ Complexity justified and documented

**Next Command**: `/speckit.tasks` to generate dependency-ordered task list
