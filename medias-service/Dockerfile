FROM node:20-alpine

WORKDIR /app

# Copy root package.json and yarn.lock for workspaces
COPY package.json yarn.lock ./

# Copy all workspace packages
COPY medias-service/package*.json ./medias-service/
COPY shared-common/package*.json ./shared-common/

# Install dependencies using workspaces
RUN yarn install --frozen-lockfile

# Copy source code and config files
COPY medias-service/src/ ./medias-service/src/
COPY medias-service/nest-cli.json ./medias-service/
COPY medias-service/tsconfig.json ./medias-service/

# Copy shared-common source
COPY shared-common/ ./shared-common/

# Create storage directories
RUN mkdir -p /app/storage/medias /app/storage/profiles

# Set working directory to service
WORKDIR /app/medias-service

# Build the application
RUN yarn build

# Expose port
ARG PORT=3001
EXPOSE ${PORT}

# Start the application
CMD ["node", "dist/medias-service/src/main"]
