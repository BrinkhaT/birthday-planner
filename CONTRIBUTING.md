# Contributing to Birthday Planner

Thank you for contributing to Birthday Planner! This document provides guidelines to ensure smooth collaboration.

## Commit Message Convention

This project uses **Conventional Commits** to maintain a clear and structured commit history. All commit messages are validated both locally (via Husky git hooks) and in CI/CD (via GitHub Actions).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type**: Required. Describes the nature of the change
- **scope**: Optional. Indicates which part of the codebase is affected (e.g., `ci`, `tests`, `api`)
- **subject**: Required. Brief description in sentence-case (max 100 characters total for type+scope+subject)
- **body**: Optional. Detailed explanation of the change
- **footer**: Optional. References to issues, breaking changes, etc.

### Allowed Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add birthday reminder notifications` |
| `fix` | Bug fix | `fix(api): resolve date parsing error for leap years` |
| `perf` | Performance improvement | `perf: optimize birthday list rendering` |
| `refactor` | Code refactoring (no functional change) | `refactor: simplify date calculation logic` |
| `docs` | Documentation changes | `docs: update API endpoint documentation` |
| `test` | Adding or modifying tests | `test: add integration tests for CRUD operations` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `build` | Build system changes | `build: configure Docker multi-stage builds` |
| `ci` | CI/CD configuration | `ci: add commit message validation to PR workflow` |
| `style` | Code style changes (formatting, whitespace) | `style: fix indentation in birthday-card.tsx` |
| `security` | Security fixes | `security: sanitize user input in birthday form` |

### Valid Commit Examples

```bash
# Simple commit with type and subject
feat: add delete confirmation dialog

# Commit with scope
fix(api): handle missing birthdate field gracefully

# Commit with body
refactor(components): simplify birthday card layout

This change removes unnecessary wrapper divs and consolidates
CSS classes for better maintainability.

# Commit with breaking change
feat!: migrate to ISO 8601 date format

BREAKING CHANGE: Birthday dates now stored in ISO 8601 format
(YYYY-MM-DD) instead of German format (DD.MM.YYYY).
Existing data will be migrated automatically.

# Commit referencing an issue
fix(validation): prevent empty birthday names

Closes #42
```

### Invalid Commit Examples

```bash
# ❌ No type
updated readme

# ❌ Invalid type
update: add new feature

# ❌ Subject not in sentence-case
feat: Add New Feature

# ❌ Subject ends with period
feat: add new feature.

# ❌ Type not in allowed list
feature: add birthday notifications
```

## Local Validation

When you run `git commit`, Husky automatically validates your commit message using commitlint. If validation fails, the commit will be rejected with a helpful error message.

### Bypassing Local Hooks (Not Recommended)

In rare cases, you may need to bypass the local commit hook:

```bash
git commit --no-verify -m "emergency fix"
```

**Warning**: PRs with invalid commit messages will still fail CI validation and cannot be merged.

## CI Validation

All pull requests to the `develop` branch are validated in GitHub Actions:

1. **Lint, Build, Test**: Standard quality checks
2. **Validate Commit Messages**: Ensures all commits in the PR follow Conventional Commits
3. **Docker Build**: Verifies Docker image builds successfully

PRs with invalid commit messages **will be blocked from merging** until fixed.

### Fixing Invalid Commits

If your PR fails commit validation:

**Option 1: Amend the last commit**
```bash
git commit --amend
# Edit the commit message to follow Conventional Commits
git push --force
```

**Option 2: Interactive rebase (for multiple commits)**
```bash
git rebase -i HEAD~3  # Reword last 3 commits
# Change 'pick' to 'reword' for commits to fix
# Save and edit each commit message
git push --force
```

**Option 3: Create a new commit**
```bash
# If you can't rewrite history (e.g., shared branch)
git commit --allow-empty -m "chore: fix commit message formatting"
```

## Testing Commit Messages

You can manually test a commit message before committing:

```bash
echo "feat: add new feature" | npx commitlint
```

## Development Workflow

1. **Clone the repository**
   ```bash
   git clone https://github.com/BrinkhaT/birthday-planner-speckit.git
   cd birthday-planner-speckit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # This automatically runs 'npm run prepare' which sets up Husky
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make changes and commit with Conventional Commits**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR to develop**
   ```bash
   git push origin feature/your-feature-name
   # Open PR targeting 'develop' branch
   ```

6. **Ensure CI checks pass**
   - All commits follow Conventional Commits
   - Lint, build, and tests pass
   - Docker build succeeds

## Questions or Issues?

If you encounter issues with commit validation or have questions about contributing:

- Open an issue: https://github.com/BrinkhaT/birthday-planner-speckit/issues
- Review existing commits for examples: `git log --oneline`

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Project README](./README.md)
