# Research: Optional BasicAuth Protection

**Feature**: 004-basicauth-env
**Date**: 2025-10-30
**Purpose**: Document technical decisions and implementation patterns for HTTP Basic Authentication in Next.js

## Technical Decisions

### 1. Next.js Middleware Implementation Approach

**Decision**: Use Next.js Edge Middleware with Edge Runtime

**Rationale**:
- Next.js Edge Middleware runs before page rendering and API route execution
- Provides centralized authentication point - single file (`middleware.ts`) protects all routes
- Edge Runtime is lightweight and fast (<5ms overhead target achievable)
- Supports conditional logic to check environment variables and skip auth when disabled
- Zero performance impact when disabled (early return before any auth checks)

**Alternatives Considered**:
- **API Route Wrappers**: Create a higher-order function to wrap each API route with auth
  - Rejected: Requires modifying every API endpoint individually, violates DRY principle
  - Would need to duplicate auth logic across multiple files
- **Custom Server (Express.js)**: Replace Next.js server with Express and add auth middleware
  - Rejected: Violates Constitution Principle II (Simplicity First) - adds major complexity
  - Breaks Next.js standalone build used in Docker
  - Requires significant infrastructure changes
- **nginx BasicAuth**: Handle authentication at reverse proxy level outside application
  - Rejected: Requires additional container/service, violates Docker-First simplicity
  - Makes credentials management more complex (nginx htpasswd files)
  - Environment variable configuration becomes more complicated

**Implementation Pattern**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if BasicAuth is enabled via environment variable
  const authEnabled = process.env.ENABLE_BASICAUTH === 'true';

  if (!authEnabled) {
    return NextResponse.next(); // Skip auth when disabled - zero overhead
  }

  // Extract and validate Authorization header
  // Return 401 with WWW-Authenticate if missing/invalid
  // Return NextResponse.next() if valid
}

export const config = {
  matcher: ['/', '/api/:path*'], // Protect all pages and API routes
};
```

### 2. Base64 Credential Decoding and Comparison Strategy

**Decision**: Use Node.js built-in `Buffer.from()` for Base64 decoding with constant-time comparison

**Rationale**:
- HTTP Basic Auth format: `Authorization: Basic <base64(username:password)>`
- Node.js Buffer API is native, no external dependencies needed
- Constant-time comparison prevents timing attacks on password validation
- Simple string operations for parsing `username:password` format

**Alternatives Considered**:
- **External crypto library**: Use bcrypt or similar for comparison
  - Rejected: Overkill for BasicAuth (passwords already transmitted in clear over HTTPS)
  - Adds dependency, violates Simplicity First
  - BasicAuth security relies on HTTPS transport, not password hashing
- **Custom Base64 decoder**: Implement own Base64 decoding
  - Rejected: Reinventing the wheel, Node.js Buffer is reliable and well-tested

**Implementation Pattern**:
```typescript
// lib/auth.ts
export function validateBasicAuth(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.slice(6); // Remove "Basic "
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  const expectedUsername = process.env.BASICAUTH_USERNAME;
  const expectedPassword = process.env.BASICAUTH_PASSWORD;

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(
    Buffer.from(username + ':' + password),
    Buffer.from(expectedUsername + ':' + expectedPassword)
  );
}
```

### 3. Environment Variable Validation and Error Handling at Startup

**Decision**: Validate credentials at application startup using Next.js instrumentation hook

**Rationale**:
- Fail-fast approach prevents misconfiguration (per user requirement Q2: Option A)
- Next.js instrumentation.ts runs before server starts - perfect timing for validation
- Clear error messages in German help administrators diagnose issues
- Prevents scenario where BasicAuth is enabled but credentials are missing (security hole)

**Alternatives Considered**:
- **Runtime validation**: Check credentials on first request
  - Rejected: Could allow brief window of unauthenticated access
  - Fails to fail-fast, could lead to confusion when first request fails
- **Startup script**: Add shell script to validate before starting Node.js
  - Rejected: Adds extra file, more complex than TypeScript validation
  - Harder to maintain, requires shell scripting knowledge
- **Default credentials fallback**: Use admin/admin if credentials missing
  - Rejected: Security vulnerability, explicitly rejected by user (Q1: Option B)

**Implementation Pattern**:
```typescript
// instrumentation.ts
export function register() {
  const authEnabled = process.env.ENABLE_BASICAUTH === 'true';

  if (authEnabled) {
    const username = process.env.BASICAUTH_USERNAME;
    const password = process.env.BASICAUTH_PASSWORD;

    if (!username || !password) {
      console.error('FEHLER: BasicAuth ist aktiviert, aber Zugangsdaten fehlen.');
      console.error('Bitte setzen Sie BASICAUTH_USERNAME und BASICAUTH_PASSWORD Umgebungsvariablen.');
      process.exit(1); // Fail-fast
    }

    console.log('✓ BasicAuth aktiviert und Zugangsdaten validiert');
  } else {
    console.log('ℹ BasicAuth ist deaktiviert');
  }
}
```

### 4. HTTP 401 Response Format and WWW-Authenticate Header Configuration

**Decision**: Return standard HTTP 401 with German realm in WWW-Authenticate header

**Rationale**:
- RFC 7235 compliant - ensures browser shows authentication dialog
- Realm message can be localized to German (shown in some browser dialogs)
- Standard format ensures compatibility with all browsers
- No response body needed - browser handles UI automatically

**Alternatives Considered**:
- **Custom 401 HTML page**: Return styled HTML error page
  - Rejected: Browser's native dialog is more standard and expected
  - Requires additional HTML/CSS, violates simplicity
- **JSON error response**: Return JSON with error details
  - Rejected: Not compatible with browser BasicAuth flow
  - Would require custom JavaScript to handle auth

**Implementation Pattern**:
```typescript
// middleware.ts
function unauthorized() {
  return new NextResponse('Authentifizierung erforderlich', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Geburtstagplaner", charset="UTF-8"',
    },
  });
}
```

### 5. German Error Message Approach for Startup Failures

**Decision**: Use German console.error() messages in instrumentation.ts startup validation

**Rationale**:
- Satisfies Constitution Principle VI (German Localization)
- Clear error messages help administrators diagnose configuration issues
- Console output is logged by Docker and visible in container logs
- Matches existing German UI language

**Alternatives Considered**:
- **English error messages**: Use English for technical logs
  - Rejected: Violates constitution requirement for German
  - Inconsistent with UI language
- **Bilingual messages**: Show both German and English
  - Rejected: Unnecessary complexity for target audience (German-speaking)

**Implementation Pattern**:
```typescript
// German error messages
console.error('FEHLER: BasicAuth ist aktiviert, aber Zugangsdaten fehlen.');
console.error('Bitte setzen Sie BASICAUTH_USERNAME und BASICAUTH_PASSWORD Umgebungsvariablen.');

// German success messages
console.log('✓ BasicAuth aktiviert und Zugangsdaten validiert');
console.log('ℹ BasicAuth ist deaktiviert');
```

## Environment Variables Design

### Required Environment Variables

| Variable | Type | Default | Description (German) |
|----------|------|---------|----------------------|
| `ENABLE_BASICAUTH` | boolean string | `"false"` | Aktiviert BasicAuth wenn `"true"` |
| `BASICAUTH_USERNAME` | string | (required if enabled) | Benutzername für BasicAuth |
| `BASICAUTH_PASSWORD` | string | (required if enabled) | Passwort für BasicAuth |

### Validation Rules

1. **ENABLE_BASICAUTH**:
   - Accepts: `"true"`, `"false"`, `"1"`, `"0"`, undefined/empty (treated as false)
   - Any other value treated as false (permissive for ease of use)

2. **BASICAUTH_USERNAME**:
   - Required when `ENABLE_BASICAUTH === "true"`
   - Must be non-empty string
   - No length restrictions (allows flexibility)

3. **BASICAUTH_PASSWORD**:
   - Required when `ENABLE_BASICAUTH === "true"`
   - Must be non-empty string
   - No complexity requirements (administrator's responsibility)

## Security Considerations

### Threat Model

**Protected Against**:
- Unauthorized access to birthday data when deployed outside trusted network
- Brute-force attacks mitigated by browser's native rate limiting
- Timing attacks on password comparison (constant-time comparison)

**Not Protected Against** (explicit limitations):
- Man-in-the-middle attacks without HTTPS (BasicAuth transmits credentials in Base64, not encrypted)
  - **Mitigation**: Administrators must deploy with HTTPS in production (outside scope)
- Credential theft if stored insecurely (e.g., plaintext in docker-compose.yml)
  - **Mitigation**: Administrators must use Docker secrets or secure env var injection (outside scope)
- Brute-force attacks if weak passwords chosen
  - **Mitigation**: Administrators must choose strong passwords (outside scope)

### Recommendations for Documentation

Include in quickstart.md:
- ⚠️ **HTTPS Required**: Always use HTTPS when BasicAuth is enabled (credentials sent as Base64, not encrypted)
- ⚠️ **Strong Passwords**: Choose strong, unique passwords for BASICAUTH_PASSWORD
- ⚠️ **Secure Storage**: Use Docker secrets or environment variable injection tools, not plaintext in version control
- ℹ️ **Browser Caching**: Browsers cache credentials for the session - logout by closing browser or clearing credentials

## Performance Impact Analysis

### When Disabled (Default)
- **Overhead**: ~0.1ms (single boolean check in middleware)
- **Impact**: Negligible - early return before any processing

### When Enabled
- **Overhead**: ~2-5ms per request
  - Header parsing: <1ms
  - Base64 decoding: <1ms
  - Constant-time comparison: <1ms
  - NextResponse overhead: ~2ms
- **Impact**: Acceptable - well below 10ms target, imperceptible to users

### Optimization Opportunities (Future)
- Cache validation result in Edge KV store (not implemented for simplicity)
- Use Web Crypto API for faster constant-time comparison (Node.js Buffer sufficient for now)

## Testing Strategy

### Manual Testing Scenarios

1. **Disabled Mode (Default)**:
   - Start app without ENABLE_BASICAUTH
   - Verify home page loads without prompt
   - Verify all API endpoints work without credentials

2. **Enabled Mode - Valid Credentials**:
   - Set ENABLE_BASICAUTH=true, USERNAME=test, PASSWORD=secret
   - Verify browser shows auth dialog
   - Enter correct credentials
   - Verify full access to pages and APIs

3. **Enabled Mode - Invalid Credentials**:
   - Enter wrong username/password
   - Verify 401 response and re-prompt

4. **Startup Validation**:
   - Set ENABLE_BASICAUTH=true without credentials
   - Verify application fails to start with German error message

5. **Docker Testing**:
   - Test with docker-compose.yml environment variables
   - Verify credentials passed correctly to container
   - Test container restart with new credentials

## References

- [RFC 7617 - HTTP Basic Authentication](https://datatracker.ietf.org/doc/html/rfc7617)
- [RFC 7235 - HTTP Authentication Framework](https://datatracker.ietf.org/doc/html/rfc7235)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [Node.js Buffer Documentation](https://nodejs.org/api/buffer.html)
- [Timing Attack Prevention](https://en.wikipedia.org/wiki/Timing_attack)
