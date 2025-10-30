# Birthday Planner

**Self-hosted birthday tracking. Your data, your server, complete privacy.**

A simple, privacy-focused birthday planner designed for families and small teams. Track birthdays with full CRUD operations, deploy in seconds with Docker, and keep your data sovereign in plain JSON files—no cloud services, no vendor lock-in.

**Status:** ✅ Fully functional and ready for deployment

## Features

### Privacy & Data Sovereignty
- 🔒 **Complete data ownership**: Your birthdays stored in plain JSON files on your server
- 📦 **Git-versionable data**: Backup via Git, track changes, easy migration
- 🚫 **Zero vendor lock-in**: No cloud services, no proprietary formats
- 👁️ **Transparent storage**: Human-readable `birthdays.json` - inspect and edit anytime

### Simple Deployment
- 🐳 **One-command deployment**: `docker-compose up -d` - that's it
- 💾 **No database required**: Eliminates setup complexity and maintenance overhead
- 🪶 **Lightweight footprint**: Alpine-based Docker image, minimal resources
- 🔄 **Persistent data**: Docker volumes ensure data survives container updates

### User Experience
- 📅 **Smart birthday view**: Upcoming birthdays (next 30 days) separated from all others
- 🎂 **Automatic age calculation**: Shows age with German formatting
- 🌍 **German localization**: Perfect for DE/AT/CH markets (de-DE)
- 📱 **Mobile-first design**: Works flawlessly from smartphone to desktop (320px-1920px)
- ⚡ **Instant feedback**: Optimistic UI updates - no waiting
- 🎨 **Modern interface**: Beautiful ShadCN UI components with Tailwind CSS

### Optional Security
- 🔐 **HTTP Basic Authentication**: Optional password protection via environment variables
- 🛡️ **Timing-attack resistant**: Constant-time credential comparison
- 🚀 **Zero overhead when disabled**: Early-return architecture for maximum performance
- ⚠️ **Fail-fast validation**: Application won't start with misconfigured credentials

### Full CRUD Operations
- ➕ **Create**: Add new birthdays via modal dialog with form validation
- ✏️ **Update**: Edit existing birthdays with pre-filled forms
- 🗑️ **Delete**: Remove birthdays with confirmation dialog
- 📋 **Read**: Browse all birthdays in card or table view

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript 5.9+
- **UI Components**: ShadCN UI + Tailwind CSS + Lucide React icons
- **Data Storage**: JSON FileStore (file-based persistence)
- **Deployment**: Docker + Docker Compose (Node.js Alpine)
- **Development**: Hot reload, ESLint, TypeScript strict mode

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production (Docker)

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Using Pre-built Docker Image

Pull and run the pre-built image from Docker Hub:

```bash
# Pull the latest image
docker pull brinkhat/birthday-planner:latest

# Run with Docker Compose (create docker-compose.yml first)
docker-compose up -d

# Or run directly with docker
docker run -d \
  -p 3000:3000 \
  -v birthday-data:/data \
  --name birthday-planner \
  brinkhat/birthday-planner:latest
```

## Project Structure

```
birthday-planner-speckit/
├── app/                      # Next.js App Router
│   ├── api/birthdays/       # API routes
│   │   ├── route.ts         # GET /api/birthdays
│   │   ├── create/route.ts  # POST /api/birthdays/create
│   │   └── [id]/route.ts    # PUT/DELETE /api/birthdays/[id]
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page with CRUD operations
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # ShadCN UI components
│   ├── birthday-card.tsx    # Birthday card with edit/delete buttons
│   ├── birthday-table.tsx   # Birthday table with edit/delete buttons
│   ├── birthday-form.tsx    # Birthday form with validation
│   ├── birthday-modal.tsx   # Modal wrapper for add/edit operations
│   └── delete-confirmation.tsx  # Delete confirmation dialog
├── lib/                     # Utility functions
│   ├── auth.ts              # Authentication utilities (BasicAuth validation)
│   ├── filestore.ts         # JSON file operations
│   ├── validations.ts       # Form validation and date conversion
│   ├── i18n-de.ts           # German localization strings
│   ├── date-utils.ts        # Date utilities (split birthdays)
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript types
│   └── birthday.ts          # Birthday type definitions
├── data/                    # JSON data directory
│   └── birthdays.json       # Birthday data file (ISO format)
├── proxy.ts                 # Next.js 16 proxy for BasicAuth
├── instrumentation.ts       # Startup validation hook
├── Dockerfile               # Docker configuration
└── docker-compose.yml       # Docker Compose setup
```

## Data Storage

Birthday data is stored in `data/birthdays.json` with the following structure:

```json
{
  "version": "1.0.0",
  "birthdays": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Paula",
      "birthDate": "1924-10-02",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

**Date Format:**
- **Internal storage**: ISO 8601 format (`YYYY-MM-DD` for full dates, `--MM-DD` for dates without year)
- **User display**: German format (`DD.MM.YYYY` for full dates, `DD.MM.` for dates without year)
- **Bidirectional conversion**: Automatic conversion between formats in forms and API

**Current test data:** Paula, Thomas, Isabel

### Managing Birthdays

Use the web interface to add, edit, or delete birthdays:
- **Add**: Click the "+" button in the header
- **Edit**: Click the edit icon on any birthday card or table row
- **Delete**: Click the delete icon and confirm the action

All operations provide instant feedback with optimistic UI updates.

## Environment Variables

Create a `.env.local` file for local development:

```env
# Data storage directory
DATA_DIR=./data

# Node environment
NODE_ENV=development

# Optional: HTTP Basic Authentication
# Uncomment to enable password protection
# ENABLE_BASICAUTH=true
# BASICAUTH_USERNAME=admin
# BASICAUTH_PASSWORD=your_secure_password
```

For Docker deployment, these are configured in `docker-compose.yml`.

### BasicAuth Configuration

To enable HTTP Basic Authentication:

1. **Development**: Add to `.env.local`:
   ```env
   ENABLE_BASICAUTH=true
   BASICAUTH_USERNAME=admin
   BASICAUTH_PASSWORD=your_secure_password
   ```

2. **Docker**: Uncomment in `docker-compose.yml`:
   ```yaml
   environment:
     - ENABLE_BASICAUTH=true
     - BASICAUTH_USERNAME=admin
     - BASICAUTH_PASSWORD=your_secure_password
   ```

3. **Security Notes**:
   - Use strong passwords in production
   - Always use HTTPS in production environments
   - Application will fail to start if credentials are missing when enabled

## Docker Deployment

The application uses a multi-stage Docker build for optimized production deployment:

- **Build stage**: Compiles the Next.js application
- **Production stage**: Runs on Node.js Alpine (minimal footprint)
- **Volume mount**: `/data` directory for persistent storage

### Publishing to Docker Hub

To publish your own version to Docker Hub:

```bash
# Build the image with your Docker Hub username
docker build -t brinkhat/birthday-planner:latest .

# Tag with version
docker tag brinkhat/birthday-planner:latest brinkhat/birthday-planner:1.0.0

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push brinkhat/birthday-planner:latest
docker push brinkhat/birthday-planner:1.0.0
```

### Volume Persistence

Birthday data persists across container restarts using Docker volumes:

```bash
# Inspect the volume
docker volume inspect birthday-planner-speckit_birthday-data

# Backup the data
docker run --rm -v birthday-planner-speckit_birthday-data:/data -v $(pwd):/backup alpine tar czf /backup/birthdays-backup.tar.gz /data

# Restore the data
docker run --rm -v birthday-planner-speckit_birthday-data:/data -v $(pwd):/backup alpine tar xzf /backup/birthdays-backup.tar.gz -C /
```

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Minimum viewport width: 320px
- Maximum tested viewport width: 1920px

## Performance

- Initial page load: <2 seconds
- API response time: <500ms
- No horizontal scrolling on any device size
- Optimized images and assets

## Architecture & Development

### AI-Assisted Development with SpecKit

This project serves as a **real-world example of AI-assisted software engineering** using:

- **[Claude Code](https://claude.com/claude-code)**: An AI coding agent by Anthropic
- **[SpecKit](https://github.com/specify-systems/specify)**: A structured specification-to-implementation framework

#### How It Was Built

The entire application was developed through a systematic AI-driven workflow:

1. **Specification Phase**: Natural language feature descriptions were converted into formal specifications
2. **Planning Phase**: Implementation plans with design artifacts (data models, API contracts, research notes)
3. **Task Generation**: Dependency-ordered task lists generated from specifications
4. **Implementation**: Code generation following the task list with automated testing
5. **Quality Analysis**: Cross-artifact consistency checks and validation

Each feature (tech baseline, split view, CRUD operations) followed this exact workflow, with the AI agent handling:
- Code generation
- Component design
- API implementation
- Docker configuration
- Testing and validation

#### Project Structure

- **`specs/`**: Feature specifications and implementation artifacts for each feature
- **`.specify/`**: SpecKit configuration, templates, and project constitution
- **`.claude/`**: Slash commands for workflow automation

This approach demonstrates how AI coding agents can deliver production-ready applications when guided by structured methodologies like SpecKit.

### Implemented Features

- **001-tech-baseline** (✅ Complete): Tech baseline with birthday list display
  - Specification: `specs/001-tech-baseline/spec.md`
  - Implementation plan: `specs/001-tech-baseline/plan.md`
  - Tasks: `specs/001-tech-baseline/tasks.md`

- **002-split-birthday-view** (✅ Complete): Split view with upcoming birthdays
  - Specification: `specs/002-split-birthday-view/spec.md`
  - Implementation plan: `specs/002-split-birthday-view/plan.md`
  - Tasks: `specs/002-split-birthday-view/tasks.md`
  - Features: Upcoming (next 30 days) + All others sections

- **003-crud-operations** (✅ Complete): Full CRUD operations for birthdays
  - Specification: `specs/003-crud-operations/spec.md`
  - Implementation plan: `specs/003-crud-operations/plan.md`
  - Tasks: `specs/003-crud-operations/tasks.md`
  - Features: Add, Edit, Delete with German localization and validation

- **004-basicauth-env** (✅ Complete): Optional HTTP Basic Authentication
  - Specification: `specs/004-basicauth-env/spec.md`
  - Implementation plan: `specs/004-basicauth-env/plan.md`
  - Tasks: `specs/004-basicauth-env/tasks.md`
  - Features: Environment-based BasicAuth, Next.js 16 proxy, fail-fast validation

### Project Principles

1. **Data Sovereignty**: Your data in plain JSON files - git-versionable, transparent, portable
2. **Simplicity First**: No database complexity, direct implementations before abstractions
3. **Privacy-Focused**: Self-hosted, no cloud services, no vendor lock-in
4. **Mobile-First Design**: Responsive across all devices with ShadCN components
5. **Docker-First Deployment**: All deployments containerized for easy setup
6. **Optional Security**: Designed for trusted environments with optional BasicAuth for additional protection
7. **SpecKit-Driven Development**: All features follow structured specification → planning → implementation

For details, see [CLAUDE.md](./CLAUDE.md) and [Constitution](./.specify/memory/constitution.md).

## About This Project

> **🤖 AI-Generated Application**: This birthday planner was primarily built by an AI coding agent ([Claude Code](https://claude.com/claude-code)) using [SpecKit](https://github.com/specify-systems/specify) for structured feature development.

The entire application—from specification to implementation—was developed through a systematic AI-driven workflow, demonstrating how AI coding agents can deliver production-ready applications when guided by structured methodologies. Each feature followed the SpecKit process: specification → planning → task generation → implementation → quality analysis.

This makes the project both a useful birthday tracking tool and a reference implementation for AI-assisted software engineering.

## License

ISC

## Contributing

Contributions are welcome! This project serves as a reference implementation for AI-assisted development with SpecKit.

### Development Workflow

All feature development follows the SpecKit methodology:

1. Create a feature specification using `/speckit.specify`
2. Generate an implementation plan with `/speckit.plan`
3. Create ordered tasks with `/speckit.tasks`
4. Implement with `/speckit.implement`

See the `.specify/` directory for templates and the project constitution.

### For AI Agents

If you're an AI coding agent working on this project, refer to [CLAUDE.md](./CLAUDE.md) for project-specific guidance and workflow instructions.

### For Human Developers

While this project was primarily built by an AI agent, human contributions are encouraged! You can:
- Add new features following the SpecKit workflow
- Improve existing functionality
- Enhance documentation
- Report issues or suggest improvements

Please ensure all contributions maintain the project's principles (see `.specify/memory/constitution.md`).
