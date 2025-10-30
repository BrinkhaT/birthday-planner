# Quickstart: Optional BasicAuth Protection

**Feature**: 004-basicauth-env
**Date**: 2025-10-30
**Purpose**: Setup and testing guide for HTTP Basic Authentication

## Overview

This feature adds optional HTTP Basic Authentication to protect the birthday planner application. Authentication is **disabled by default** and can be enabled via environment variables.

## Prerequisites

- Docker and Docker Compose installed (for production deployment)
- Node.js 20+ installed (for development)
- Existing birthday planner application (features 001-003)

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENABLE_BASICAUTH` | No | `false` | Set to `"true"` to enable BasicAuth |
| `BASICAUTH_USERNAME` | Yes (if enabled) | - | Username for authentication |
| `BASICAUTH_PASSWORD` | Yes (if enabled) | - | Password for authentication |

### Example Configurations

#### Development (.env.local)

```bash
# Disabled (default)
# No configuration needed - authentication is off by default

# Enabled
ENABLE_BASICAUTH=true
BASICAUTH_USERNAME=admin
BASICAUTH_PASSWORD=secure_password_here
```

#### Production (docker-compose.yml)

```yaml
services:
  birthday-planner:
    image: birthday-planner:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
    environment:
      # Disabled (default)
      # ENABLE_BASICAUTH: "false"  # Optional - default is false

      # Enabled
      ENABLE_BASICAUTH: "true"
      BASICAUTH_USERNAME: "admin"
      BASICAUTH_PASSWORD: "your_secure_password"
```

## Setup Instructions

### Option 1: Development Mode (npm run dev)

1. **Create or edit `.env.local`** in repository root:
   ```bash
   ENABLE_BASICAUTH=true
   BASICAUTH_USERNAME=testuser
   BASICAUTH_PASSWORD=testpass123
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Verify startup**:
   - Check console for: `✓ BasicAuth aktiviert und Zugangsdaten validiert`
   - If error: `FEHLER: BasicAuth ist aktiviert, aber Zugangsdaten fehlen.`

4. **Test in browser**:
   - Navigate to http://localhost:3000
   - Browser shows authentication dialog
   - Enter username: `testuser`, password: `testpass123`
   - Application loads normally

### Option 2: Docker Production Mode

1. **Edit `docker-compose.yml`** to add environment variables:
   ```yaml
   services:
     birthday-planner:
       # ... existing configuration ...
       environment:
         DATA_DIR: /data
         ENABLE_BASICAUTH: "true"
         BASICAUTH_USERNAME: "admin"
         BASICAUTH_PASSWORD: "${BASICAUTH_PASSWORD}"  # Use env var for security
   ```

2. **Create `.env` file** (for Docker Compose, not committed to git):
   ```bash
   BASICAUTH_PASSWORD=your_very_secure_password_here
   ```

3. **Build and start container**:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. **Check logs**:
   ```bash
   docker-compose logs birthday-planner
   ```
   - Look for: `✓ BasicAuth aktiviert und Zugangsdaten validiert`

5. **Test in browser**:
   - Navigate to http://localhost:3000
   - Enter configured credentials
   - Verify access

### Option 3: Disable Authentication (Default)

1. **Remove or comment out environment variables**:
   ```yaml
   # docker-compose.yml
   environment:
     DATA_DIR: /data
     # ENABLE_BASICAUTH: "false"  # Default - can be omitted
   ```

2. **Restart application**:
   ```bash
   docker-compose restart
   ```

3. **Check logs**:
   ```bash
   docker-compose logs birthday-planner
   ```
   - Look for: `ℹ BasicAuth ist deaktiviert`

4. **Test in browser**:
   - Navigate to http://localhost:3000
   - Page loads immediately without authentication prompt

## Testing Scenarios

### 1. Test Disabled Mode (Default Behavior)

**Steps**:
1. Ensure `ENABLE_BASICAUTH` is not set or set to `"false"`
2. Start application
3. Open http://localhost:3000

**Expected Result**:
- ✅ No authentication prompt
- ✅ Home page loads immediately
- ✅ All API endpoints work without credentials
- ✅ Console shows: `ℹ BasicAuth ist deaktiviert`

### 2. Test Enabled Mode - Valid Credentials

**Steps**:
1. Set `ENABLE_BASICAUTH=true`
2. Set `BASICAUTH_USERNAME=testuser`
3. Set `BASICAUTH_PASSWORD=testpass123`
4. Start application
5. Open http://localhost:3000
6. Enter username: `testuser`, password: `testpass123`

**Expected Result**:
- ✅ Browser shows authentication dialog
- ✅ After entering correct credentials, home page loads
- ✅ Birthday list displays normally
- ✅ Add/Edit/Delete operations work
- ✅ Console shows: `✓ BasicAuth aktiviert und Zugangsdaten validiert`

### 3. Test Enabled Mode - Invalid Credentials

**Steps**:
1. Configure as in Test 2
2. Open http://localhost:3000
3. Enter username: `wrong`, password: `incorrect`

**Expected Result**:
- ✅ Authentication dialog appears
- ✅ After entering wrong credentials, browser shows error
- ✅ Dialog re-appears for retry
- ✅ Access denied until correct credentials entered

### 4. Test API Protection

**Steps**:
1. Configure BasicAuth enabled (as in Test 2)
2. Use curl or Postman to test API endpoint:

   ```bash
   # Without credentials - should fail
   curl -i http://localhost:3000/api/birthdays

   # With credentials - should succeed
   curl -i -u testuser:testpass123 http://localhost:3000/api/birthdays
   ```

**Expected Result**:
- ✅ Without credentials: HTTP 401 Unauthorized
- ✅ Response header includes: `WWW-Authenticate: Basic realm="Geburtstagplaner"`
- ✅ With credentials: HTTP 200 OK with birthday data

### 5. Test Startup Validation (Missing Credentials)

**Steps**:
1. Set `ENABLE_BASICAUTH=true`
2. Do NOT set `BASICAUTH_USERNAME` or `BASICAUTH_PASSWORD`
3. Attempt to start application

**Expected Result**:
- ✅ Application fails to start
- ✅ Console shows German error message:
  ```
  FEHLER: BasicAuth ist aktiviert, aber Zugangsdaten fehlen.
  Bitte setzen Sie BASICAUTH_USERNAME und BASICAUTH_PASSWORD Umgebungsvariablen.
  ```
- ✅ Process exits with code 1

### 6. Test Credential Change

**Steps**:
1. Start application with credentials `user1:pass1`
2. Successfully authenticate
3. Stop application
4. Change to `user2:pass2`
5. Start application
6. Attempt to access with old credentials `user1:pass1`

**Expected Result**:
- ✅ Old credentials rejected (401 Unauthorized)
- ✅ New credentials `user2:pass2` work correctly

## Troubleshooting

### Problem: Application fails to start with "Zugangsdaten fehlen"

**Cause**: BasicAuth is enabled but username or password not configured

**Solution**:
- Add `BASICAUTH_USERNAME` and `BASICAUTH_PASSWORD` environment variables
- OR set `ENABLE_BASICAUTH=false` to disable authentication

### Problem: Browser keeps prompting for credentials even after entering correct ones

**Possible Causes**:
1. Credentials are incorrect (check for typos, case sensitivity)
2. Environment variables not passed to container correctly
3. Special characters in password need escaping

**Solution**:
- Verify credentials in docker-compose.yml or .env.local
- Check Docker logs: `docker-compose logs birthday-planner`
- Try simpler password without special characters for testing
- Restart browser (sometimes credentials get cached incorrectly)

### Problem: Authentication works in development but not in Docker

**Cause**: Environment variables not passed to Docker container

**Solution**:
- Verify `docker-compose.yml` includes environment variables under `environment:` section
- Check Docker logs for startup messages
- Test with: `docker-compose exec birthday-planner env | grep BASICAUTH`

### Problem: Want to share credentials securely

**Solution**:
- Use Docker secrets (production): [Docker Secrets Documentation](https://docs.docker.com/engine/swarm/secrets/)
- Use environment variable injection tools (e.g., Vault, AWS Secrets Manager)
- Never commit credentials to git repositories
- Use `.env` files with `.gitignore` for local development only

## Security Best Practices

### ⚠️ Important Security Considerations

1. **HTTPS Required in Production**:
   - BasicAuth sends credentials as Base64 (not encrypted)
   - Always use HTTPS when BasicAuth is enabled
   - Use reverse proxy (nginx, Traefik) with SSL/TLS certificates

2. **Strong Passwords**:
   - Use strong, unique passwords for `BASICAUTH_PASSWORD`
   - Minimum 12+ characters with mixed case, numbers, symbols
   - Use password manager to generate and store

3. **Credential Storage**:
   - Never commit credentials to git
   - Use `.env` files locally (add to `.gitignore`)
   - Use Docker secrets or secure environment variable injection in production

4. **Browser Credential Caching**:
   - Browsers cache BasicAuth credentials per session
   - To "logout", close browser or clear credentials manually
   - No automatic logout mechanism in BasicAuth

5. **Rate Limiting** (Future Enhancement):
   - Consider adding rate limiting for brute-force protection
   - Currently relies on browser's built-in rate limiting

### Recommended Production Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  birthday-planner:
    image: birthday-planner:latest
    environment:
      ENABLE_BASICAUTH: "true"
      BASICAUTH_USERNAME: "${BASICAUTH_USERNAME}"
      BASICAUTH_PASSWORD: "${BASICAUTH_PASSWORD}"
    volumes:
      - ./data:/data
    networks:
      - internal

  # Reverse proxy with HTTPS
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - birthday-planner
    networks:
      - internal

networks:
  internal:
```

## Performance Impact

### Disabled Mode (Default)
- **Overhead**: <1ms per request
- **Impact**: Negligible

### Enabled Mode
- **Overhead**: 2-5ms per request
- **Impact**: Imperceptible to users
- **Browser Caching**: After first authentication, browser sends credentials automatically

## Next Steps

After setting up and testing BasicAuth:

1. **Review security**: Ensure HTTPS is configured if deploying outside trusted network
2. **Test all features**: Verify CRUD operations work with authentication enabled
3. **Document credentials**: Store credentials securely using password manager
4. **Monitor logs**: Check Docker logs for any authentication errors
5. **Plan updates**: Consider additional security features (rate limiting, session timeout)

## Related Documentation

- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Technical Research](./research.md)
- [RFC 7617 - HTTP Basic Authentication](https://datatracker.ietf.org/doc/html/rfc7617)
