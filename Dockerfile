# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV DATA_DIR=/data

# Create data directory
RUN mkdir -p /data

# Copy standalone build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy initial data file if not exists
COPY --from=builder /app/data/birthdays.json /tmp/birthdays.json

# Create volume mount point
VOLUME ["/data"]

EXPOSE 3000

CMD ["sh", "-c", "if [ ! -f /data/birthdays.json ]; then cp /tmp/birthdays.json /data/birthdays.json; fi && node server.js"]
