# Freight Calculator API - Dockerfile
# Multi-stage build for production

# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package files for dependency installation
COPY package.json package-lock.json ./
COPY server/package.json server/package-lock.json ./server/

# Install root dependencies (for Prisma)
RUN npm ci --ignore-scripts

# Install server dependencies
WORKDIR /app/server
RUN npm ci

# Copy Prisma schema and config
WORKDIR /app
COPY prisma ./prisma
COPY prisma.config.ts ./

# Generate Prisma client
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# Copy server source code
COPY server ./server

# Build TypeScript
WORKDIR /app/server
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install dependencies for Prisma runtime
RUN apk add --no-cache openssl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy root package files (for Prisma CLI)
COPY --from=builder /app/package.json /app/package-lock.json ./

# Install Prisma CLI only
RUN npm ci --only=production --ignore-scripts

# Copy server package files
COPY --from=builder /app/server/package.json /app/server/package-lock.json ./server/

# Install server production dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/server/dist ./dist

# Copy Prisma generated client (server imports from ../../../lib/generated/prisma)
WORKDIR /app
COPY --from=builder /app/lib/generated ./lib/generated

# Copy Prisma schema (needed for migrations)
COPY --from=builder /app/prisma ./prisma

WORKDIR /app/server

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Run migrations and start server
ENTRYPOINT ["/app/docker-entrypoint.sh"]
