#!/bin/bash

echo "🧪 Testing Development Workflow..."
echo ""

# Test 1: Check if shared-common can build
echo "1️⃣ Testing shared-common build..."
cd shared-common
if yarn build; then
    echo "✅ shared-common builds successfully"
else
    echo "❌ shared-common build failed"
    exit 1
fi
cd ..

# Test 2: Check if services can resolve shared-common
echo ""
echo "2️⃣ Testing service TypeScript compilation..."
cd auth-service
if npx tsc --noEmit; then
    echo "✅ auth-service can resolve shared-common"
else
    echo "❌ auth-service cannot resolve shared-common"
    exit 1
fi
cd ..

cd main-service
if npx tsc --noEmit; then
    echo "✅ main-service can resolve shared-common"
else
    echo "❌ main-service cannot resolve shared-common"
    exit 1
fi
cd ..

cd user-permission-gateway
if npx tsc --noEmit; then
    echo "✅ user-permission-gateway can resolve shared-common"
else
    echo "❌ user-permission-gateway cannot resolve shared-common"
    exit 1
fi
cd ..

# Test 3: Check if concurrently is installed
echo ""
echo "3️⃣ Testing concurrently installation..."
if yarn list concurrently > /dev/null 2>&1; then
    echo "✅ concurrently is installed"
else
    echo "❌ concurrently is not installed"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Development workflow is ready."
echo ""
echo "🚀 You can now run:"
echo "   make dev          # Start all services"
echo "   yarn dev:all      # Alternative command"
echo "   yarn dev:shared   # Start only shared-common watch mode"
