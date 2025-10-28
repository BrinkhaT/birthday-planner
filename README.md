# Birthday Planner

A responsive web application for tracking upcoming birthdays, built for home lab deployment.

**Status:** ✅ Tech baseline complete - Application is fully functional and ready for deployment

## Features

- 📅 View all birthdays in an easy-to-read list
- 📱 Mobile-first responsive design (320px - 1920px viewports)
- 🎨 Modern UI with ShadCN components and Tailwind CSS
- 🐳 Docker-ready with Docker Compose support
- 💾 Simple JSON file storage (no database required)
- ⚡ Fast API responses (<500ms)
- 🔒 Internal network deployment (no authentication needed)

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

## Project Structure

```
birthday-planner-speckit/
├── app/                      # Next.js App Router
│   ├── api/birthdays/       # API routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # ShadCN UI components
│   └── birthday-card.tsx    # Birthday card component
├── lib/                     # Utility functions
│   ├── filestore.ts         # JSON file operations
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript types
│   └── birthday.ts          # Birthday type definitions
├── data/                    # JSON data directory
│   └── birthdays.json       # Birthday data file
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
      "birthDate": "02.10.24",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

**Current test data:** Paula (02.10.24), Thomas (29.08.88), Isabel (12.07.90)

### Adding Birthdays

Edit `data/birthdays.json` and add new entries to the `birthdays` array. The application will automatically detect changes on next API call (no restart required).

## Environment Variables

Create a `.env.local` file for local development:

```env
DATA_DIR=./data
NODE_ENV=development
```

For Docker deployment, these are configured in `docker-compose.yml`.

## Docker Deployment

The application uses a multi-stage Docker build for optimized production deployment:

- **Build stage**: Compiles the Next.js application
- **Production stage**: Runs on Node.js Alpine (minimal footprint)
- **Volume mount**: `/data` directory for persistent storage

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

### SpecKit-Driven Development

This project uses [SpecKit](https://github.com/specify-systems/specify) for structured feature development:

- Feature specifications in `specs/` directory
- Constitution-driven development (see `.specify/memory/constitution.md`)
- Slash commands for workflow automation (see `.claude/commands/`)

### Implemented Features

- **001-tech-baseline** (✅ Complete): Tech baseline with birthday list display
  - Specification: `specs/001-tech-baseline/spec.md`
  - Implementation plan: `specs/001-tech-baseline/plan.md`
  - Tasks: `specs/001-tech-baseline/tasks.md`

### Project Principles

1. **Simplicity First**: JSON storage before databases, direct implementations before abstractions
2. **Responsive Design**: Mobile-first with ShadCN components
3. **Docker-First**: All deployments containerized
4. **No Authentication**: Internal network only, no login required
5. **SpecKit Workflow**: All features follow structured specification → planning → implementation

For details, see [CLAUDE.md](./CLAUDE.md) and [Constitution](./.specify/memory/constitution.md).

## License

ISC

## Contributing

This is a private home lab application. Development follows the SpecKit workflow - see `.specify/` directory for templates and constitution.
