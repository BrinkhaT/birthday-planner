# Changelog

## [1.1.4](https://github.com/BrinkhaT/birthday-planner/compare/1.1.3...1.1.4) (2025-10-30)


### Bug Fixes

* use RELEASE_TOKEN to trigger sync-release workflow ([1cfa05f](https://github.com/BrinkhaT/birthday-planner/commit/1cfa05f3d81f5c49de72b75c2f8a1bb477b348b6))


### Miscellaneous Chores

* add @types/node ignore rule to maintain Node 20 LTS ([3fc7189](https://github.com/BrinkhaT/birthday-planner/commit/3fc7189a6271631c57fe7e78c0091e89247a72d4))
* release preparation - workflow fixes and dependency updates ([e0ed234](https://github.com/BrinkhaT/birthday-planner/commit/e0ed234f3b502655bbceeba04ca07737ed866256))

## [1.1.3](https://github.com/BrinkhaT/birthday-planner/compare/1.1.2...1.1.3) (2025-10-30)


### Miscellaneous Chores

* add Docker base image monitoring to Dependabot ([9938309](https://github.com/BrinkhaT/birthday-planner/commit/9938309bf1b0d57667f385b1fe1018eb06a68f87))
* add Docker monitoring to Dependabot with Node 20 pinning ([70fd5e1](https://github.com/BrinkhaT/birthday-planner/commit/70fd5e17730d6d3eac5fa1bddfd1dd1628e7bb5e))

## [1.1.2](https://github.com/BrinkhaT/birthday-planner/compare/1.1.1...1.1.2) (2025-10-30)


### Miscellaneous Chores

* dependency updates and release automation improvements ([564c6ec](https://github.com/BrinkhaT/birthday-planner/commit/564c6ec00c78ea2c93dd38d2018f5905ce180bd5))
* revert Dependabot schedule from daily to weekly ([3906ba7](https://github.com/BrinkhaT/birthday-planner/commit/3906ba7a752f79681f991adbcec902895d9bdac1))


### Continuous Integration

* add automatic release sync from main to develop ([5aa85a6](https://github.com/BrinkhaT/birthday-planner/commit/5aa85a65ccf35ffa9d5be09eba118cfa5dd86b02))
* **deps:** Bump actions/checkout from 4 to 5 ([14eacd8](https://github.com/BrinkhaT/birthday-planner/commit/14eacd89a25326f3eab8b4fa8a317f0be781cf71))
* **deps:** Bump actions/upload-artifact from 4 to 5 ([ef8cfa7](https://github.com/BrinkhaT/birthday-planner/commit/ef8cfa730fdde27cecc3be9edcbb9990d772a43b))
* **deps:** Bump github/codeql-action from 3 to 4 ([5fa3190](https://github.com/BrinkhaT/birthday-planner/commit/5fa3190cf2bd4d982ee4188b5236723f7211fb27))

## [1.1.1](https://github.com/BrinkhaT/birthday-planner/compare/1.1.0...1.1.1) (2025-10-30)


### Bug Fixes

* remove redundant SARIF upload step in CodeQL workflow ([de49d62](https://github.com/BrinkhaT/birthday-planner/commit/de49d625b3fe05b09ae851a1b2303afb6f442e9e))
* remove unused variable in futureByYear useMemo ([88ede7c](https://github.com/BrinkhaT/birthday-planner/commit/88ede7cc3aeac23afe1f294e7ff5aa494280d605))


### Miscellaneous Chores

* change Dependabot schedule to daily for testing ([70584d4](https://github.com/BrinkhaT/birthday-planner/commit/70584d47aee4a4dc992c3f7198e141c416423939))


### Continuous Integration

* add CodeQL security analysis and Dependabot ([fb1da73](https://github.com/BrinkhaT/birthday-planner/commit/fb1da73db48fc0fcd124d084497cc384a8aae296))
* add security scanning and enhance CI/CD pipeline ([1d8f5dc](https://github.com/BrinkhaT/birthday-planner/commit/1d8f5dc3a4982f06b46f3e5d6515c291a586c505))
* integrate PR validation jobs into develop workflow ([5609af2](https://github.com/BrinkhaT/birthday-planner/commit/5609af2bdb44489f831fe171884d26853bfa440a))

## [1.1.0](https://github.com/BrinkhaT/birthday-planner/compare/1.0.0...1.1.0) (2025-10-29)


### Features

* add optional year support and migrate to 4-digit year format ([2fa5fae](https://github.com/BrinkhaT/birthday-planner/commit/2fa5fae63b2ac3977abcd605217c5fa863e699ff))
* add split birthday view specification and planning artifacts ([428792b](https://github.com/BrinkhaT/birthday-planner/commit/428792b18bb2bcf490cfc7aebdf409ae18df84c8))
* add tech baseline specification and implementation plan ([f468ce3](https://github.com/BrinkhaT/birthday-planner/commit/f468ce365fdc661f095f90a547c104e6dd14b0de))
* complete CRUD operations for birthday management ([74aa33d](https://github.com/BrinkhaT/birthday-planner/commit/74aa33dab323bbd46345567eb29ccc4f9d01032e))
* compress birthday table with year grouping and auto-create missing data file ([2735ee9](https://github.com/BrinkhaT/birthday-planner/commit/2735ee96c37856a3ae6ae132520737982cd1fd8c))
* implement birthday CRUD with ISO format and German display ([7ac809b](https://github.com/BrinkhaT/birthday-planner/commit/7ac809bfec1641a0b976770781582eb46efc600d))
* implement split birthday view with German localization ([2af07e6](https://github.com/BrinkhaT/birthday-planner/commit/2af07e6b97682753adfd8c6e523ecaea2546d4b6))
* implement tech baseline - birthday list display (complete) ([90432ab](https://github.com/BrinkhaT/birthday-planner/commit/90432ab57aa7bb09cc911855750a94f548ed02d9))


### Bug Fixes

* add .gitkeep to public directory for Docker build ([6611197](https://github.com/BrinkhaT/birthday-planner/commit/66111977daac91832a398912cfefd898efa60352))
* correct age calculation to show age at next birthday ([60f305d](https://github.com/BrinkhaT/birthday-planner/commit/60f305d51bc3490af0f9fd2b071a0b121e67d808))
* correct birthday date comparison and improve card display ([46fde17](https://github.com/BrinkhaT/birthday-planner/commit/46fde17ffc1f1d203ad12590b656e0c6c4d178b4))
* remove unused referenceDate parameter from groupBirthdaysByYear call ([86aebe6](https://github.com/BrinkhaT/birthday-planner/commit/86aebe6c1f0bf1ef00a21d4bed184aa899045968))


### Documentation

* establish constitution v1.0.0 and project guidance ([fed4d69](https://github.com/BrinkhaT/birthday-planner/commit/fed4d69e2e8686368a202734e73ae3c71ea17ded))
* prepare repository for public release with AI-assisted development highlights ([4aa6d2e](https://github.com/BrinkhaT/birthday-planner/commit/4aa6d2e3462394968d5c6fee7edf56c06d65e832))
* refocus documentation on birthday planner value and user benefits ([53c948c](https://github.com/BrinkhaT/birthday-planner/commit/53c948c5672e4af85de9fd1fe565981ed7e78a08))
* update CLAUDE.md and README.md to reflect current implementation ([d901cdf](https://github.com/BrinkhaT/birthday-planner/commit/d901cdf25ad7f4cfd93f76290efeb0dad85f54bd))


### Miscellaneous Chores

* fix Node.js version alignment to 20.x ([0c8bd23](https://github.com/BrinkhaT/birthday-planner/commit/0c8bd233249057a8bd4c1d1064c6f5a130fc759f))
* migrate to ESLint 9 flat config and fix all linting errors ([d940355](https://github.com/BrinkhaT/birthday-planner/commit/d940355056b6f4f4ed1fc32c20b75adf988c5534))
* remove personal data and add local data store support ([e2b90fa](https://github.com/BrinkhaT/birthday-planner/commit/e2b90fac15a2e79c7f636717a2981c0013f8306d))
* reorganize package.json dependencies for production optimization ([fa10b10](https://github.com/BrinkhaT/birthday-planner/commit/fa10b109d2c16ff69ab5d1caab6248e4ad218716))


### Continuous Integration

* add GitHub Actions workflow for develop branch ([a24cd62](https://github.com/BrinkhaT/birthday-planner/commit/a24cd6257f8aa92ef6acf3870363b5889c70609c))
* implement release-please with multi-platform Docker builds ([5d8a4b9](https://github.com/BrinkhaT/birthday-planner/commit/5d8a4b9b2cd8508ec96541c704e9e003b3180ad9))

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
