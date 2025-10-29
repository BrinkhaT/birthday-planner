# Security Policy

## Supported Versions

We release security updates for the following versions of Birthday Planner:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Birthday Planner seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Open a Public Issue

Please **do not** open a public GitHub issue for security vulnerabilities. This helps prevent malicious exploitation before a fix is available.

### 2. Report Privately

Report security vulnerabilities by:

- **GitHub Security Advisories**: Use the [Security tab](../../security/advisories/new) to report privately
- **Email**: Contact the maintainer directly (if email is provided in profile)

### 3. Provide Details

Include as much information as possible:

- **Description**: Clear description of the vulnerability
- **Impact**: What could an attacker accomplish?
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Versions**: Which versions are affected?
- **Proposed Fix**: If you have suggestions (optional)

### 4. Response Timeline

- **Initial Response**: Within 48 hours
- **Triage**: Within 5 business days
- **Fix Timeline**: Depends on severity
  - **Critical**: 7 days
  - **High**: 14 days
  - **Medium**: 30 days
  - **Low**: Next release cycle

### 5. Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We request that you do not publicly disclose the vulnerability until we have released a fix

## Security Features

### Current Security Measures

- **CodeQL Analysis**: Automated security scanning on all commits and PRs
- **Dependabot**: Automated dependency vulnerability scanning and updates
- **ESLint**: Code quality and potential security issue detection
- **Docker**: Containerized deployment with minimal attack surface
- **Input Validation**: German date format validation and sanitization
- **Type Safety**: TypeScript for compile-time type checking

### Scope

This security policy applies to:

- ✅ Birthday Planner application code
- ✅ API endpoints (`/api/birthdays/*`)
- ✅ Docker configuration
- ✅ GitHub Actions workflows
- ✅ Dependencies (npm packages)

This security policy does **not** apply to:

- ❌ Third-party services (Docker Hub, npm registry)
- ❌ User's deployment environment
- ❌ Physical security of self-hosted instances

## Security Best Practices

### For Deployment

If you are self-hosting Birthday Planner, we recommend:

1. **Network Security**
   - Deploy behind a reverse proxy (nginx, Caddy)
   - Use HTTPS with valid TLS certificates
   - Implement firewall rules (only port 3000 exposed internally)
   - Consider VPN access for remote usage

2. **Data Security**
   - Regular backups of `birthdays.json`
   - File system permissions (read-write only for app user)
   - Volume encryption (if storing sensitive data)

3. **Updates**
   - Monitor GitHub releases for security updates
   - Subscribe to Dependabot alerts
   - Apply updates promptly (especially security patches)

4. **Access Control** (Future)
   - BasicAuth planned for future releases
   - Consider implementing authentication for internet-exposed instances

## Known Limitations

### Security Considerations

- **No Built-in Authentication**: Currently designed for trusted environments only
- **JSON FileStore**: Not suitable for concurrent multi-user environments
- **Data Privacy**: Birthday data stored in plain JSON (no encryption at rest)

### Recommendations

- **Internal Use Only**: Recommended for home networks or trusted environments
- **BasicAuth**: Planned for future releases to add basic access control
- **Data Sensitivity**: Avoid storing highly sensitive personal information

## Acknowledgments

We appreciate the security research community and thank those who responsibly disclose vulnerabilities.

## Questions?

If you have questions about this security policy, please open a discussion in the GitHub Discussions tab.

---

Last Updated: 2025-10-29
