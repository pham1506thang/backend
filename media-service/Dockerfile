# Multi-stage Dockerfile for media-service
FROM node:20-alpine AS base

# Install dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY media-service/package*.json ./media-service/
COPY shared-common/package*.json ./shared-common/

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# ==================== DEVELOPMENT STAGE ====================
FROM base AS development
# Copy only necessary source code
COPY shared-common ./shared-common
COPY media-service ./media-service
WORKDIR /app

# Create storage directories
RUN mkdir -p /app/storage/medias /app/storage/profiles

# Build shared-common for development
RUN yarn workspace shared-common build

# Start with hot-reload
CMD ["yarn", "workspace", "media-service", "start:dev"]

# ==================== BUILDER STAGE ====================
FROM base AS builder
# Copy only necessary source code
COPY shared-common ./shared-common
COPY media-service ./media-service
WORKDIR /app

# Build shared-common first
RUN yarn workspace shared-common build

# Build the application
RUN yarn workspace media-service build

# ==================== PRODUCTION STAGE ====================
FROM node:20-alpine AS production

# Install only production dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY media-service/package*.json ./media-service/
COPY shared-common/package*.json ./shared-common/

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/shared-common/dist ./shared-common/dist
COPY --from=builder /app/media-service/dist ./media-service/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

WORKDIR /app/media-service

# Create storage directories after switching to non-root user
RUN mkdir -p /app/storage/medias /app/storage/profiles

# Start the application
CMD ["dumb-init", "node", "dist/main.js"]
