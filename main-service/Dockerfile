FROM node:20-alpine

WORKDIR /app

# Copy root package.json and yarn.lock for workspaces
COPY package.json yarn.lock ./

# Copy all workspace packages
COPY main-service/package*.json ./main-service/
COPY shared-common/package*.json ./shared-common/

# Install dependencies using workspaces
RUN yarn install --frozen-lockfile

# Copy source code and config files
COPY main-service/src/ ./main-service/src/
COPY main-service/nest-cli.json ./main-service/
COPY main-service/tsconfig.json ./main-service/

# Copy shared-common source
COPY shared-common/ ./shared-common/

# Set working directory to service
WORKDIR /app/main-service

# Build the application
RUN yarn build

# Expose port
ARG PORT=3000
EXPOSE ${PORT}

# Start the application
CMD ["node", "dist/main-service/src/main"]
