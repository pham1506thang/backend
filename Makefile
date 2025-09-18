# Microservices Backend Makefile

# Load environment variables from .env file
include .env
export

.PHONY: help build up down logs clean clean-all install migrate test up-dev up-prod down-dev down-prod health-direct

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build all services"
	@echo "  up        - Start all services (production mode)"
	@echo "  up-dev    - Start all services in development mode"
	@echo "  up-prod   - Start all services in production mode"
	@echo "  down      - Stop all services"
	@echo "  down-dev  - Stop development services"
	@echo "  down-prod - Stop production services"
	@echo "  logs      - Show logs for all services"
	@echo "  clean     - Clean up containers and volumes"
	@echo "  clean-all - Clean up ALL Docker resources (containers, images, volumes, networks)"
	@echo "  install   - Install dependencies for all services"
	@echo "  migrate   - Run all migrations"
	@echo "  test      - Test API endpoints"
	@echo "  health    - Check service health status"
	@echo "  restart   - Restart all services"
	@echo ""
	@echo "Database Information:"
	@echo "  - Main Service DB: localhost:$(DB_PORT_EXTERNAL) (maindb)"
	@echo "  - Medias Service DB: localhost:$(MEDIAS_DB_PORT_EXTERNAL) (mediasdb)"
	@echo "  - RabbitMQ Management: http://localhost:$(RABBITMQ_MANAGEMENT_PORT_EXTERNAL)"
	@echo ""
	@echo "API Gateway:"
	@echo "  - Nginx Gateway: http://localhost:8080"
	@echo ""
	@echo "Service Routes (via Gateway):"
	@echo "  - Auth Service: http://localhost:8080/api/auths/"
	@echo "  - Main Service: http://localhost:8080/api/ (user, role, health modules)"
	@echo "  - Medias Service: http://localhost:8080/api/medias/ (commented out - not ready)"
	@echo "  - User Permission Gateway: Internal only (not accessible from outside)"
	@echo "  - Nginx Health: http://localhost:8080/nginx-health"
	@echo ""
	@echo "Service Internal Ports:"
	@echo "  - Main Service: $(MAIN_SERVICE_PORT)"
	@echo "  - Auth Service: $(AUTH_SERVICE_PORT)"
	@echo "  - Medias Service: $(MEDIAS_SERVICE_PORT)"
	@echo "  - User Permission Gateway: $(USER_PERMISSION_GATEWAY_PORT)"
	@echo ""
	@echo "Environment Commands:"
	@echo "  make up-dev   - Start in development mode (with hot reload)"
	@echo "  make up-prod  - Start in production mode"
	@echo "  make health-direct - Check direct health status of all services (for debugging)"

# Build all services
build:
	docker-compose build

# Start all services (production mode)
up:
	docker-compose up -d

# Start all services in development mode
up-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Start all services in production mode
up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Stop all services
down:
	docker-compose down

# Stop development services
down-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# Stop production services
down-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Show logs
logs:
	docker-compose logs -f

# Clean up project only
clean:
	docker-compose down -v
	docker system prune -f

# Clean up ALL Docker resources (WARNING: Removes everything)
clean-all:
	@echo "⚠️  WARNING: This will remove ALL Docker containers, images, volumes, and networks!"
	@echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
	@sleep 5
	docker-compose down -v --rmi all
	docker stop $$(docker ps -aq) 2>/dev/null || true
	docker rm $$(docker ps -aq) -f 2>/dev/null || true
	docker rmi $$(docker images -q) -f 2>/dev/null || true
	docker volume rm $$(docker volume ls -q) -f 2>/dev/null || true
	docker network rm $$(docker network ls -q) -f 2>/dev/null || true
	docker system prune -a -f --volumes
	docker builder prune -a -f
	@echo "✅ All Docker resources have been cleaned up!"

# Install dependencies
install:
	cd main-service && npm install
	cd auth-service && npm install
	cd medias-service && npm install
	cd user-permission-gateway && npm install

# Run migrations
migrate:
	./run-migrations.sh

# Run tests
test:
	cd main-service && npm test
	cd auth-service && npm test
	cd medias-service && npm test
	cd user-permission-gateway && npm test

# Development commands
dev: ## Start all services in development mode (recommended)
	@echo "Starting all services in development mode..."
	@npm run dev:all

dev-shared: ## Start only shared-common in watch mode
	@echo "Starting shared-common in watch mode..."
	@npm run dev:shared

dev-services: ## Start all services except shared-common
	@echo "Starting all services..."
	@concurrently "npm run dev:auth" "npm run dev:main" "npm run dev:gateway" "npm run dev:medias"

dev-main:
	cd main-service && npm run start:dev

dev-auth:
	cd auth-service && npm run start:dev

dev-medias:
	cd medias-service && npm run start:dev

dev-gateway:
	cd user-permission-gateway && npm run start:dev

# Service-specific commands
migrate-main:
	cd main-service && npm run migration:setup-admin

migrate-medias:
	cd medias-service && npm run migration:setup-media

# Health check commands - direct to services
health:
	@echo "Checking service health (direct)..."
	@echo "Nginx Gateway: $$(curl -s http://localhost:8080/nginx-health 2>/dev/null | grep -q healthy && echo "✅" || echo "❌")"
	@echo "Main Service: $$(docker-compose exec -T main-service wget --quiet --tries=1 --spider http://localhost:$(MAIN_SERVICE_PORT)/health 2>/dev/null && echo "✅" || echo "❌")"
	@echo "Auth Service: $$(docker-compose exec -T auth-service wget --quiet --tries=1 --spider http://localhost:$(AUTH_SERVICE_PORT)/health 2>/dev/null && echo "✅" || echo "❌")"
	@echo "Gateway Service: $$(docker-compose exec -T user-permission-gateway wget --quiet --tries=1 --spider http://localhost:$(USER_PERMISSION_GATEWAY_PORT)/health 2>/dev/null && echo "✅" || echo "❌")"

# Service management
restart:
	@echo "Restarting all services..."
	@docker-compose restart

restart-main:
	@echo "Restarting Main Service..."
	@docker-compose restart main-service

restart-auth:
	@echo "Restarting Auth Service..."
	@docker-compose restart auth-service

# Database commands
db-main:
	docker-compose exec db psql -U postgres -d maindb

db-medias:
	docker-compose exec medias-db psql -U postgres -d mediasdb
