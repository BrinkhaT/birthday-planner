# Research: Tech Baseline - Birthday List Display

**Feature**: 001-tech-baseline
**Date**: 2025-10-28
**Purpose**: Research technical decisions and best practices for establishing the Birthday Planner baseline

## Research Questions

1. Next.js 14+ App Router setup and best practices
2. ShadCN UI integration with Next.js
3. JSON FileStore implementation patterns
4. Docker configuration for Next.js applications
5. Mobile-first responsive design patterns
6. API route patterns in Next.js App Router

## Decisions & Rationale

### 1. Next.js Version and Router Choice

**Decision**: Use Next.js 14+ with App Router

**Rationale**:
- App Router is the recommended approach for new Next.js applications
- Server Components provide better performance
- Simplified data fetching with async/await
- Built-in API routes in the same codebase
- Better TypeScript support

**Alternatives Considered**:
- Pages Router: Older pattern, still supported but not recommended for new projects
- Separate frontend/backend: Unnecessary complexity for this use case

### 2. ShadCN UI Integration

**Decision**: Use ShadCN with Tailwind CSS for UI components

**Rationale**:
- Copy-paste component pattern (no npm dependency bloat)
- Full customization control
- Built on Radix UI primitives (accessible)
- Works seamlessly with Tailwind CSS
- Follows constitution principle III (responsive design)

**Implementation Notes**:
- Initialize ShadCN with `npx shadcn-ui@latest init`
- Install only needed components (Card, Button for baseline)
- Components live in `components/ui/` directory

**Alternatives Considered**:
- Material UI: Heavier bundle, less customizable
- Custom CSS: More work, less consistent

### 3. JSON FileStore Pattern

**Decision**: Simple Node.js fs operations with atomic writes

**Rationale**:
- Simplest approach per constitution principle II
- No database overhead
- Readable, version-controllable data format
- Sufficient for home lab use case
- Easy to backup and restore

**Implementation Pattern**:
```typescript
// lib/filestore.ts
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = process.env.DATA_DIR || './data';

export async function readBirthdays() {
  const filePath = join(DATA_DIR, 'birthdays.json');
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function writeBirthdays(birthdays: Birthday[]) {
  const filePath = join(DATA_DIR, 'birthdays.json');
  const temp = filePath + '.tmp';
  await writeFile(temp, JSON.stringify(birthdays, null, 2));
  await rename(temp, filePath); // Atomic operation
}
```

**Data Schema**:
```json
{
  "version": "1.0.0",
  "birthdays": [
    {
      "id": "uuid",
      "name": "string",
      "birthDate": "MM.DD.YY",
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    }
  ]
}
```

**Alternatives Considered**:
- SQLite: Over-engineered for 3 birthdays
- LocalStorage: Server-side storage needed for API
- Environment variables: Not suitable for mutable data

### 4. Docker Configuration

**Decision**: Multi-stage Docker build with Node.js Alpine base

**Rationale**:
- Smaller image size (Alpine Linux)
- Optimized production builds
- Volume mount for `/data` directory
- Environment variables for configuration
- Follows constitution principle IV

**Dockerfile Pattern**:
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**Volume Mount**: `/data` directory for JSON files

**Alternatives Considered**:
- Full Node.js image: Larger size (500MB+ vs 150MB)
- Docker Compose: Will be added but not required
- Kubernetes: Over-engineered for home lab

### 5. Responsive Design Approach

**Decision**: Mobile-first CSS with Tailwind breakpoints

**Rationale**:
- Tailwind provides mobile-first utilities by default
- ShadCN components are responsive out of the box
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Constitution principle III mandates mobile-first
- Success criteria specify 320px-1920px support

**Layout Pattern**:
```tsx
<div className="container mx-auto px-4 py-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">Birthdays</h1>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {/* Birthday cards */}
  </div>
</div>
```

**Alternatives Considered**:
- CSS Grid only: Less flexible across breakpoints
- Fixed widths: Doesn't meet responsive requirements

### 6. API Route Structure

**Decision**: Next.js App Router API routes with TypeScript

**Rationale**:
- Integrated with Next.js (no separate server)
- Type-safe request/response
- Serverless-ready architecture
- Simple REST pattern for baseline

**Endpoint Pattern**:
```typescript
// app/api/birthdays/route.ts
import { NextResponse } from 'next/server';
import { readBirthdays } from '@/lib/filestore';

export async function GET() {
  try {
    const birthdays = await readBirthdays();
    return NextResponse.json(birthdays);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load birthdays' },
      { status: 500 }
    );
  }
}
```

**Alternatives Considered**:
- Express.js: Separate server, unnecessary complexity
- GraphQL: Over-engineered for simple GET endpoint
- tRPC: Adds dependency, YAGNI for baseline

## Technology Stack Summary

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| Runtime | Node.js | 20 LTS | Stable, long-term support |
| Framework | Next.js | 14+ | App Router, integrated API |
| Language | TypeScript | 5+ | Type safety, better DX |
| UI Library | React | 18+ | Required by Next.js |
| UI Components | ShadCN | Latest | Constitution requirement |
| Styling | Tailwind CSS | 3+ | Utility-first, responsive |
| Storage | Node.js fs | Native | JSON FileStore pattern |
| Container | Docker | Latest | Constitution requirement |
| Base Image | node:20-alpine | Latest | Minimal size |

## Best Practices Applied

1. **Simplicity First**: No unnecessary abstractions or libraries
2. **Type Safety**: TypeScript throughout
3. **Error Handling**: Try-catch blocks, user-friendly error messages
4. **Performance**: Static generation where possible, optimized builds
5. **Responsive**: Mobile-first CSS, tested across viewport sizes
6. **Deployment**: Docker-ready, volume-mounted data
7. **Maintainability**: Clear file structure, documented decisions

## Open Questions (Resolved)

All technical questions have been resolved through research. No clarifications needed for implementation.

## References

- Next.js 14 Documentation: https://nextjs.org/docs
- ShadCN UI Setup: https://ui.shadcn.com/docs/installation/next
- Tailwind CSS: https://tailwindcss.com/docs
- Docker Multi-stage Builds: https://docs.docker.com/build/building/multi-stage/
- Node.js File System: https://nodejs.org/api/fs.html
