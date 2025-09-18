FROM node:20-alpine

WORKDIR /app

# Copy root package.json and yarn.lock for workspaces
COPY package.json yarn.lock ./

# Copy all workspace packages
COPY user-permission-gateway/package*.json ./user-permission-gateway/
COPY shared-common/package*.json ./shared-common/

# Install dependencies using workspaces
RUN yarn install --frozen-lockfile

# Copy source code and config files
COPY user-permission-gateway/src/ ./user-permission-gateway/src/
COPY user-permission-gateway/nest-cli.json ./user-permission-gateway/
COPY user-permission-gateway/tsconfig.json ./user-permission-gateway/

# Copy shared-common source
COPY shared-common/ ./shared-common/

# Set working directory to service
WORKDIR /app/user-permission-gateway

# Build the application
RUN yarn build

# Expose port
ARG PORT=3004
EXPOSE ${PORT}

# Start the application
CMD ["node", "dist/user-permission-gateway/src/main"]
