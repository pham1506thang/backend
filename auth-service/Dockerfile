FROM node:20-alpine

WORKDIR /app

# Copy root package.json and yarn.lock for workspaces
COPY package.json yarn.lock ./

# Copy all workspace packages
COPY auth-service/package*.json ./auth-service/
COPY shared-common/package*.json ./shared-common/

# Install dependencies using workspaces
RUN yarn install --frozen-lockfile

# Copy source code and config files
COPY auth-service/src/ ./auth-service/src/
COPY auth-service/nest-cli.json ./auth-service/
COPY auth-service/tsconfig.json ./auth-service/

# Copy shared-common source
COPY shared-common/ ./shared-common/

# Set working directory to service
WORKDIR /app/auth-service

# Build the application
RUN yarn build

# Expose port
ARG PORT=3002
EXPOSE ${PORT}

# Start the application
CMD ["node", "dist/auth-service/src/main"]
