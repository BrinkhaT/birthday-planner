module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce conventional commit types aligned with release-please-config.json
    'type-enum': [
      2,
      'always',
      [
        'feat',      // Features
        'fix',       // Bug Fixes
        'perf',      // Performance Improvements
        'refactor',  // Code Refactoring
        'docs',      // Documentation
        'chore',     // Miscellaneous Chores
        'build',     // Build System
        'ci',        // Continuous Integration
        'test',      // Tests
        'style',     // Styles
        'security',  // Security fixes (used in commits but not in release-please)
      ],
    ],
    // Scope is optional (e.g., ci, tests, api)
    'scope-empty': [0, 'never'],
    // Subject should start lowercase or sentence-case (allows Dependabot "Bump" commits)
    'subject-case': [2, 'always', ['lower-case', 'sentence-case']],
    // Subject should not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Subject should not be empty
    'subject-empty': [2, 'never'],
    // Header (type + scope + subject) max length
    'header-max-length': [2, 'always', 100],
    // Body max line length - disabled to allow long URLs/links in Dependabot commits
    'body-max-line-length': [0, 'always', Infinity],
  },
};
