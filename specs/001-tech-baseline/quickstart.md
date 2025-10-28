# Quickstart: Tech Baseline - Birthday List Display

**Feature**: 001-tech-baseline
**Date**: 2025-10-28
**Purpose**: Quick setup and validation guide for the birthday planner baseline

## Prerequisites

- Node.js 20+ installed
- Docker installed (for containerized deployment)
- Git (for version control)

## Quick Setup (Development)

### 1. Initialize Next.js Project

```bash
# Create Next.js app with TypeScript
npx create-next-app@latest birthday-planner --typescript --tailwind --app --no-src-dir

cd birthday-planner
```

### 2. Install ShadCN UI

```bash
# Initialize ShadCN
npx shadcn-ui@latest init

# When prompted, select:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Install Card component
npx shadcn-ui@latest add card
```

### 3. Create Project Structure

```bash
# Create directories
mkdir -p lib data app/api/birthdays components/ui

# Create data file
cat > data/birthdays.json << 'EOF'
{
  "version": "1.0.0",
  "birthdays": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Paula",
      "birthDate": "02.20.24",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Thomas",
      "birthDate": "29.08.88",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Isabel",
      "birthDate": "12.07.90",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
EOF
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Quick Setup (Docker)

### 1. Build Docker Image

```bash
# Build the image
docker build -t birthday-planner:latest .

# Run the container
docker run -p 3000:3000 -v $(pwd)/data:/data birthday-planner:latest
```

Open http://localhost:3000 in your browser.

### 2. Using Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Validation Checklist

### Functional Validation

- [ ] Application loads without errors
- [ ] Home page displays birthday list
- [ ] Three test birthdays are visible (Paula, Thomas, Isabel)
- [ ] Each birthday shows name and birth date
- [ ] No console errors in browser dev tools

### Responsive Design Validation

- [ ] Mobile view (320px width): List displays properly
- [ ] Tablet view (768px width): List displays properly
- [ ] Desktop view (1920px width): List displays properly
- [ ] No horizontal scrolling on any device size
- [ ] Text is readable on all screen sizes

### API Validation

```bash
# Test API endpoint
curl http://localhost:3000/api/birthdays

# Expected response:
# {
#   "version": "1.0.0",
#   "birthdays": [
#     { "id": "...", "name": "Paula", ... },
#     { "id": "...", "name": "Thomas", ... },
#     { "id": "...", "name": "Isabel", ... }
#   ]
# }
```

- [ ] API returns 200 status code
- [ ] API returns valid JSON
- [ ] API returns all three test birthdays
- [ ] Response matches OpenAPI contract

### Docker Validation

- [ ] Docker image builds successfully
- [ ] Container starts without errors
- [ ] Application accessible at http://localhost:3000
- [ ] Data volume is mounted correctly
- [ ] Changes to `/data/birthdays.json` persist after container restart

### Performance Validation

- [ ] Initial page load completes in under 2 seconds
- [ ] API response time under 500ms
- [ ] No layout shifts during loading
- [ ] Loading state is visible during data fetch

## Common Issues & Solutions

### Issue: Port 3000 already in use

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Issue: File permission errors with Docker

**Solution**:
```bash
# Ensure data directory has correct permissions
chmod 755 data
chmod 644 data/birthdays.json
```

### Issue: ShadCN components not styling correctly

**Solution**:
```bash
# Verify Tailwind config includes component paths
# Check tailwind.config.ts includes:
# content: ["./components/**/*.{js,ts,jsx,tsx}"]
```

### Issue: API returns 500 error

**Solution**:
```bash
# Check if data file exists and is valid JSON
cat data/birthdays.json | jq .

# Check file path in environment
echo $DATA_DIR

# Verify file permissions
ls -la data/birthdays.json
```

## Development Workflow

### 1. Start Development

```bash
npm run dev
```

### 2. Make Changes

Edit files in:
- `app/page.tsx` - Home page
- `app/api/birthdays/route.ts` - API endpoint
- `components/` - React components
- `lib/` - Utility functions

### 3. Test Changes

- View in browser (hot reload enabled)
- Test API with curl or Postman
- Check responsive design with browser dev tools

### 4. Build for Production

```bash
npm run build
npm start
```

### 5. Build Docker Image

```bash
docker build -t birthday-planner:latest .
docker run -p 3000:3000 -v $(pwd)/data:/data birthday-planner:latest
```

## Success Criteria Validation

Verify all success criteria from spec.md:

- **SC-001**: Users can view the complete birthday list within 2 seconds ✓
- **SC-002**: Application displays correctly on mobile (320px+) ✓
- **SC-003**: Application displays correctly on desktop (up to 1920px) ✓
- **SC-004**: All three test birthdays visible and readable ✓
- **SC-005**: No horizontal scrolling on any device size ✓

## Next Steps

After baseline validation:

1. Run `/speckit.tasks` to generate implementation task list
2. Execute tasks with `/speckit.implement`
3. Test each acceptance scenario from spec.md
4. Deploy to home lab Docker environment
5. Consider future features (add/edit/delete birthdays, sorting, filtering)

## Environment Variables

For production deployment:

```env
# .env.local or Docker environment
NODE_ENV=production
DATA_DIR=/data
PORT=3000
```

## File Structure Reference

```
birthday-planner/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (birthday list)
│   └── api/
│       └── birthdays/
│           └── route.ts     # GET /api/birthdays
├── components/
│   └── ui/
│       └── card.tsx         # ShadCN Card component
├── lib/
│   ├── filestore.ts         # JSON file operations
│   └── utils.ts             # Helper functions
├── data/
│   └── birthdays.json       # Birthday data
├── public/                  # Static assets
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose setup
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
└── next.config.js           # Next.js config
```
