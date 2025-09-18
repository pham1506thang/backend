# Microservices Backend

This project consists of 3 microservices with **separate databases**:

## Services

### 1. Main Service (Port 3000)

- **Purpose**: Core business logic, user management, role management
- **Database**: PostgreSQL (maindb) - Port 5432
- **Features**: User CRUD, Role management, Permission system, GrowthBook integration
- **Dependencies**:
  - Connects to **maindb** (PostgreSQL)
  - Communicates with **Auth Service** for JWT verification
  - Communicates with **Medias Service** for media operations

### 2. Auth Service (Port 3002)

- **Purpose**: Authentication and authorization
- **Database**: None (stateless)
- **Features**: Login, JWT generation, password management, token refresh
- **Dependencies**:
  - Communicates with **Main Service** for user data lookup
  - No direct database connection

### 3. Medias Service (Port 3001)

- **Purpose**: Media file management and processing
- **Database**: PostgreSQL (mediasdb) - Port 5433
- **Features**: File upload, image processing, versioning, async processing via RabbitMQ
- **Dependencies**:
  - Connects to **mediasdb** (PostgreSQL)
  - Connects to **RabbitMQ** for async processing
  - Communicates with **Auth Service** for JWT verification
  - Communicates with **Main Service** for user data

## Database Architecture

### Main Service Database (maindb)

- **Host**: db (Docker) / localhost (local)
- **Port**: 5432
- **Database**: maindb
- **Tables**: users, roles, permissions, role_permissions, user_roles
- **Used by**: Main Service only

### Medias Service Database (mediasdb)

- **Host**: medias-db (Docker) / localhost (local)
- **Port**: 5433
- **Database**: mediasdb
- **Tables**: media, media_version, media_size, media_tag, media_tags_media
- **Used by**: Medias Service only

### Shared Services

- **RabbitMQ**: Used by Medias Service for async processing
- **Auth Service**: Stateless, no database

## Setup

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

### Quick Start

1. **Clone and setup**:

   ```bash
   git clone <repository>
   cd backend
   ```

2. **Setup environment variables**:

   ```bash
   # Copy example files
   cp main-service/.env.example main-service/.env
   cp auth-service/.env.example auth-service/.env
   cp medias-service/.env.example medias-service/.env

   # Update values as needed
   ```

3. **Start all services**:
   ```bash
   docker-compose up
   ```

### Service URLs

- **Main Service**: http://localhost:3000
- **Auth Service**: http://localhost:3002
- **Medias Service**: http://localhost:3001
- **RabbitMQ Management**: http://localhost:15672

### Database Access

- **Main Service DB**: localhost:5432 (maindb)
- **Medias Service DB**: localhost:5433 (mediasdb)

### Development

#### Run individual services locally:

```bash
# Main Service
cd main-service
npm install
npm run start:dev

# Auth Service
cd auth-service
npm install
npm run start:dev

# Medias Service
cd medias-service
npm install
npm run start:dev
```

#### Run migrations:

```bash
# All migrations
./run-migrations.sh

# Individual migrations
npm run migration:main
npm run migration:medias
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Main Service  │    │   Auth Service  │    │ Medias Service  │
│   (Port 3000)   │    │   (Port 3002)   │    │   (Port 3001)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Port 5432)   │
                    │     maindb      │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Port 5433)   │
                    │    mediasdb     │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │    RabbitMQ     │
                    │   (Port 5672)   │
                    └─────────────────┘
```

## Service Communication

### Main Service

- **Database**: Connects to maindb (PostgreSQL)
- **Auth**: Communicates with Auth Service for JWT verification
- **Media**: Communicates with Medias Service for media operations

### Auth Service

- **Database**: None (stateless)
- **User Data**: Communicates with Main Service for user lookup
- **JWT**: Generates and validates JWT tokens

### Medias Service

- **Database**: Connects to mediasdb (PostgreSQL)
- **Auth**: Communicates with Auth Service for JWT verification
- **User Data**: Communicates with Main Service for user data
- **Processing**: Uses RabbitMQ for async processing

## Environment Variables

Each service has its own `.env` file with specific configurations:

- `main-service/.env` - Main service configuration
- `auth-service/.env` - Auth service configuration
- `medias-service/.env` - Medias service configuration

See `.env.example` files in each service directory for reference.

## Database Schema

### Main Service Database (maindb)

- `users` - User data
- `roles` - Role definitions
- `permissions` - Permission definitions
- `role_permissions` - Role-Permission mapping
- `user_roles` - User-Role mapping

### Medias Service Database (mediasdb)

- `media` - Media files metadata
- `media_version` - Media versioning
- `media_size` - Multiple file sizes
- `media_tag` - Media tags
- `media_tags_media` - Media-Tag mapping

## Commands

### Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Clean up
docker-compose down -v
```

### Make Commands

```bash
# Show help
make help

# Build all services
make build

# Start all services
make up

# Stop all services
make down

# View logs
make logs

# Run migrations
make migrate

# Clean up
make clean
```

### Database Commands

```bash
# Connect to Main Service DB
make db-main

# Connect to Medias Service DB
make db-medias
```

## Development Workflow

1. **Start services**: `docker-compose up`
2. **Run migrations**: `./run-migrations.sh`
3. **Access services**:
   - Main Service: http://localhost:3000
   - Auth Service: http://localhost:3002
   - Medias Service: http://localhost:3001
4. **Monitor logs**: `docker-compose logs -f`

## Production Deployment

Use `docker-compose.prod.yml` for production:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports 3000, 3001, 3002, 5432, 5433, 5672 are available
2. **Database connection**: Ensure PostgreSQL containers are running
3. **RabbitMQ connection**: Check RabbitMQ container status
4. **Environment variables**: Verify `.env` files are properly configured

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f main-service
docker-compose logs -f auth-service
docker-compose logs -f medias-service
```

### Database Access

```bash
# Main Service DB
docker-compose exec db psql -U postgres -d maindb

# Medias Service DB
docker-compose exec medias-db psql -U postgres -d mediasdb
```

## Important Notes

### Database Separation

- **Main Service** và **Medias Service** có database riêng biệt
- **Auth Service** không có database (stateless)
- Mỗi service chỉ connect đến database của mình
- Không có shared database giữa các services

### Service Dependencies

- **Main Service**: maindb + Auth Service
- **Auth Service**: Main Service (for user data)
- **Medias Service**: mediasdb + RabbitMQ + Auth Service + Main Service

### Data Flow

1. **Authentication**: Auth Service → Main Service (user lookup)
2. **Media Operations**: Medias Service → Auth Service (JWT verification)
3. **User Data**: Medias Service → Main Service (user data)
4. **Async Processing**: Medias Service → RabbitMQ
