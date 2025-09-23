# Simple Makefile for Docker operations
# Usage: make <target> [service_name]

.PHONY: help up down build logs dev clean restart status exec

# Default target
help:
	@echo "=== ALL SERVICES ==="
	@echo "  up       - Start all services in production mode"
	@echo "  dev      - Start all services in development mode"
	@echo "  down     - Stop all services"
	@echo "  build    - Build all services"
	@echo "  logs     - Show logs for all services"
	@echo "  restart  - Restart all services"
	@echo "  status   - Show status of all services"
	@echo "  clean    - Remove containers, networks, and volumes"
	@echo ""
	@echo "=== INDIVIDUAL SERVICES ==="
	@echo "  up <name>       - Start specific service"
	@echo "  down <name>     - Stop specific service"
	@echo "  build <name>    - Build specific service"
	@echo "  logs <name>     - Show logs for specific service"
	@echo "  restart <name>  - Restart specific service"
	@echo "  exec <name>     - Execute command in specific service container"
	@echo ""
	@echo "Available services: main-service, auth-service, media-service,"
	@echo "                   user-permission-gateway, nginx-gateway, db,"
	@echo "                   media-db, rabbitmq"

# Production mode
up:
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		docker-compose up -d --build $(filter-out $@,$(MAKECMDGOALS)); \
	else \
		docker-compose up -d --build --remove-orphans; \
	fi

# Development mode
dev:
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build $(filter-out $@,$(MAKECMDGOALS)); \
	else \
		docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --remove-orphans; \
	fi

# Stop all services
down:
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		docker-compose stop $(filter-out $@,$(MAKECMDGOALS)); \
	else \
		docker-compose down; \
	fi

# Build all services
build:
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		docker-compose build $(filter-out $@,$(MAKECMDGOALS)); \
	else \
		docker-compose build; \
	fi

# Show logs
logs:
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		docker-compose logs -f $(filter-out $@,$(MAKECMDGOALS)); \
	else \
		docker-compose logs -f; \
	fi

# Restart all services
restart:
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		docker-compose restart $(filter-out $@,$(MAKECMDGOALS)); \
	else \
		docker-compose restart; \
	fi

# Show ps
ps:
	docker-compose ps

# Show stats
stats:
	docker-compose stats

# Execute command in service container
exec:
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "Usage: make exec <service_name> [command]"; \
		echo "Example: make exec main-service bash"; \
		echo "Example: make exec db psql -U postgres"; \
		exit 1; \
	fi
	@SERVICE_NAME=$(firstword $(filter-out $@,$(MAKECMDGOALS))); \
	COMMAND=$(wordlist 2,999,$(filter-out $@,$(MAKECMDGOALS))); \
	if [ -z "$$COMMAND" ]; then \
		docker-compose exec -it $$SERVICE_NAME sh; \
	else \
		docker-compose exec -it $$SERVICE_NAME $$COMMAND; \
	fi

# Clean up everything
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Prevent make from treating service names as targets
%:
	@: