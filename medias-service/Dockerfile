# Multi-stage Dockerfile for medias-service
FROM node:20-alpine AS base

# Install dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY medias-service/package*.json ./medias-service/
COPY shared-common/package*.json ./shared-common/

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# ==================== DEVELOPMENT STAGE ====================
FROM base AS development
# Copy only necessary source code
COPY shared-common ./shared-common
COPY medias-service ./medias-service
WORKDIR /app

# Create storage directories
RUN mkdir -p /app/storage/medias /app/storage/profiles

# Build shared-common for development
RUN yarn workspace shared-common build

# Start with hot-reload
CMD ["yarn", "workspace", "medias-service", "start:dev"]

# ==================== BUILDER STAGE ====================
FROM base AS builder
# Copy only necessary source code
COPY shared-common ./shared-common
COPY medias-service ./medias-service
WORKDIR /app

# Build shared-common first
RUN yarn workspace shared-common build

# Build the application
RUN yarn workspace medias-service build

# ==================== PRODUCTION STAGE ====================
FROM node:20-alpine AS production

# Install only production dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY medias-service/package*.json ./medias-service/
COPY shared-common/package*.json ./shared-common/

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/shared-common/dist ./shared-common/dist
COPY --from=builder /app/medias-service/dist ./medias-service/dist

# Create storage directories
RUN mkdir -p /app/storage/medias /app/storage/profiles

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

WORKDIR /app/medias-service

# Start the application
CMD ["dumb-init", "node", "dist/medias-service/src/main.js"]
