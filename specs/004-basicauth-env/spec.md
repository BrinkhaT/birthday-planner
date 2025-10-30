# Feature Specification: Optional BasicAuth Protection

**Feature Branch**: `004-basicauth-env`
**Created**: 2025-10-30
**Status**: Draft
**Input**: User description: "ich möchte eine zusätzliche Auth methode haben. Es soll möglich sein, BasicAuth per ENV zu aktivieren. Wenn aktiviert, dann ist die Seite und die APIs durch BasicAuth geschützt, wenn deaktiviert, dann komplett ohne Auth."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enable BasicAuth Protection (Priority: P1)

Administrator wants to enable BasicAuth protection for the birthday planner application to secure it when deploying outside the trusted home network (e.g., VPN access, DMZ deployment).

**Why this priority**: This is the core functionality - enabling optional authentication protection. Without this, the feature provides no value. It's independently testable and delivers immediate security value when enabled.

**Independent Test**: Can be fully tested by setting the activation environment variable, starting the container, and verifying that all pages and API endpoints require BasicAuth credentials. The application should prompt for username/password before allowing access.

**Acceptance Scenarios**:

1. **Given** BasicAuth is enabled via environment variable, **When** user navigates to the home page without credentials, **Then** browser shows HTTP Basic Authentication dialog
2. **Given** BasicAuth is enabled and user enters correct credentials, **When** user submits the authentication dialog, **Then** user gains access to the birthday list page
3. **Given** BasicAuth is enabled and user enters incorrect credentials, **When** user submits the authentication dialog, **Then** browser shows authentication failed message and prompts again
4. **Given** BasicAuth is enabled, **When** API endpoints are called without credentials, **Then** API returns 401 Unauthorized status
5. **Given** BasicAuth is enabled and user is authenticated, **When** user accesses API endpoints, **Then** API processes requests normally

---

### User Story 2 - Disable BasicAuth (Default Behavior) (Priority: P2)

Administrator wants to run the application without authentication when deployed in trusted home network environment, maintaining the current simple deployment model.

**Why this priority**: Maintains backward compatibility and default behavior. Essential for existing users who deploy on internal networks. Independently testable as the opposite of P1.

**Independent Test**: Can be fully tested by not setting the activation environment variable (or explicitly disabling it), starting the container, and verifying that all pages and APIs are accessible without any authentication prompts.

**Acceptance Scenarios**:

1. **Given** BasicAuth is not activated (no environment variable set), **When** user navigates to the home page, **Then** user sees the birthday list immediately without authentication prompt
2. **Given** BasicAuth is not activated, **When** API endpoints are called, **Then** API processes requests normally without checking credentials
3. **Given** BasicAuth is explicitly disabled via environment variable, **When** user accesses the application, **Then** behavior is identical to not setting the variable (no authentication)

---

### User Story 3 - Configure BasicAuth Credentials (Priority: P3)

Administrator wants to configure username and password for BasicAuth via environment variables to avoid hardcoding credentials and enable flexible deployment configurations.

**Why this priority**: Enhances P1 by making credentials configurable. Can be tested independently by changing credentials and verifying new credentials work. Not critical for MVP - could default to fixed credentials initially.

**Independent Test**: Can be fully tested by setting different username/password combinations via environment variables, restarting the container, and verifying that only the configured credentials grant access while old credentials are rejected.

**Acceptance Scenarios**:

1. **Given** custom username and password are provided via environment variables, **When** user attempts to authenticate, **Then** only the configured credentials grant access
2. **Given** no credentials are explicitly configured but BasicAuth is enabled, **When** application attempts to start, **Then** application fails to start with clear error message indicating missing BASICAUTH_USERNAME and BASICAUTH_PASSWORD environment variables
3. **Given** credentials are changed via environment variables and container is restarted, **When** user attempts to authenticate with old credentials, **Then** authentication fails
4. **Given** credentials are changed via environment variables and container is restarted, **When** user attempts to authenticate with new credentials, **Then** authentication succeeds

---

### Edge Cases

- What happens when BasicAuth environment variable is set to an invalid value (not true/false, not 0/1, etc.)?
- How does the system handle empty username or empty password in environment variables when BasicAuth is enabled?
- What happens when user closes browser and returns - do they need to re-authenticate?
- How does the system behave if environment variables are changed without restarting the container?
- What happens when API requests include malformed Authorization headers?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an environment variable to enable/disable BasicAuth protection (e.g., `ENABLE_BASICAUTH=true|false`)
- **FR-002**: System MUST protect ALL pages with BasicAuth when enabled (home page, any future pages)
- **FR-003**: System MUST protect ALL API endpoints with BasicAuth when enabled (GET /api/birthdays, POST /api/birthdays/create, PUT/DELETE /api/birthdays/[id])
- **FR-004**: System MUST support environment variables for configuring BasicAuth username (e.g., `BASICAUTH_USERNAME`)
- **FR-005**: System MUST support environment variables for configuring BasicAuth password (e.g., `BASICAUTH_PASSWORD`)
- **FR-006**: System MUST return HTTP 401 Unauthorized status when authentication fails or is missing (when enabled)
- **FR-007**: System MUST use standard HTTP Basic Authentication protocol (RFC 7617) with Base64-encoded credentials
- **FR-008**: System MUST support persistent authentication within the same browser session (credentials cached by browser)
- **FR-009**: System MUST work identically to current behavior when BasicAuth is disabled (zero authentication checks)
- **FR-010**: System MUST validate that required credentials (username and password) are configured when BasicAuth is enabled, and MUST prevent application startup with a clear error message if credentials are missing
- **FR-011**: System MUST show German error messages when authentication fails (e.g., "Authentifizierung fehlgeschlagen" not "Authentication failed")
- **FR-012**: Docker configuration MUST be updated to expose BasicAuth environment variables in docker-compose.yml

### Key Entities

No new data entities required. This feature operates at the infrastructure/middleware level, protecting access to existing Birthday entities without modifying their structure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can enable BasicAuth protection by setting a single environment variable and restarting the container (under 2 minutes total configuration time)
- **SC-002**: When BasicAuth is enabled, 100% of unauthorized access attempts to pages and APIs receive 401 Unauthorized responses
- **SC-003**: When BasicAuth is disabled, application performs identically to current version (zero performance overhead, zero authentication prompts)
- **SC-004**: Authenticated users experience seamless access to all features without repeated authentication prompts during a browsing session
- **SC-005**: Configuration changes (enable/disable BasicAuth or change credentials) take effect within 30 seconds of container restart
