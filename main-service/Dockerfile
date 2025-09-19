# Multi-stage Dockerfile for main-service
FROM node:20-alpine AS base

# Install dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY main-service/package*.json ./main-service/
COPY shared-common/package*.json ./shared-common/

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# ==================== DEVELOPMENT STAGE ====================
FROM base AS development
# Copy only necessary source code
COPY shared-common ./shared-common
COPY main-service ./main-service
WORKDIR /app

# Build shared-common for development
RUN yarn workspace shared-common build

# Port configuration handled by docker-compose

# Start with hot-reload
CMD ["yarn", "workspace", "main-service", "start:dev"]

# ==================== BUILDER STAGE ====================
FROM base AS builder
# Copy only necessary source code
COPY shared-common ./shared-common
COPY main-service ./main-service
WORKDIR /app

# Build shared-common first
RUN yarn workspace shared-common build

# Build the application
RUN yarn workspace main-service build

# ==================== PRODUCTION STAGE ====================
FROM node:20-alpine AS production

# Install only production dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY main-service/package*.json ./main-service/
COPY shared-common/package*.json ./shared-common/

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/shared-common/dist ./shared-common/dist
COPY --from=builder /app/main-service/dist ./main-service/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

WORKDIR /app/main-service

# Port configuration handled by docker-compose

# Start the application
CMD ["dumb-init", "node", "dist/main-service/src/main.js"]
