#!/bin/bash

# Run all migrations for microservices
echo "🚀 Running migrations for all services..."

# Main Service migrations
echo "📊 Running Main Service migrations..."
cd main-service
npm run migration:setup-admin
cd ..

# Medias Service migrations  
echo "📸 Running Medias Service migrations..."
cd medias-service
npm run migration:setup-media
cd ..

echo "✅ All migrations completed!"
echo ""
echo "📋 Database Information:"
echo "  - Main Service DB: localhost:5432 (maindb)"
echo "  - Medias Service DB: localhost:5433 (mediasdb)"
echo "  - RabbitMQ Management: http://localhost:15672"
