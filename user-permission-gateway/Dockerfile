# Multi-stage Dockerfile for user-permission-gateway
FROM node:20-alpine AS base

# Install dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY user-permission-gateway/package*.json ./user-permission-gateway/
COPY shared-common/package*.json ./shared-common/

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# ==================== DEVELOPMENT STAGE ====================
FROM base AS development
# Copy only necessary source code
COPY shared-common ./shared-common
COPY user-permission-gateway ./user-permission-gateway
WORKDIR /app

# Build shared-common for development
RUN yarn workspace shared-common build

# Port configuration handled by docker-compose

# Start with hot-reload
CMD ["yarn", "workspace", "user-permission-gateway", "start:dev"]

# ==================== BUILDER STAGE ====================
FROM base AS builder
# Copy only necessary source code
COPY shared-common ./shared-common
COPY user-permission-gateway ./user-permission-gateway
WORKDIR /app

# Build shared-common first
RUN yarn workspace shared-common build

# Build the application
RUN yarn workspace user-permission-gateway build

# ==================== PRODUCTION STAGE ====================
FROM node:20-alpine AS production

# Install only production dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY user-permission-gateway/package*.json ./user-permission-gateway/
COPY shared-common/package*.json ./shared-common/

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/shared-common/dist ./shared-common/dist
COPY --from=builder /app/user-permission-gateway/dist ./user-permission-gateway/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

WORKDIR /app/user-permission-gateway

# Port configuration handled by docker-compose

# Start the application
CMD ["dumb-init", "node", "dist/user-permission-gateway/src/main.js"]
