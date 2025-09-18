# Development Workflow

## 🚀 Quick Start

### Cách 1: Development Mode (Khuyến nghị)
```bash
# Start tất cả services cùng lúc
make dev

# Hoặc sử dụng yarn
yarn dev:all
```

### Cách 2: Docker Development
```bash
# Sử dụng Docker với hot reload
make up-dev

# Hoặc
docker-compose -f docker-compose.dev.yml up --build
```

## 📁 Project Structure

```
backend/
├── shared-common/          # Shared library (TypeScript)
├── auth-service/           # Authentication service
├── main-service/          # Main CMS service  
├── medias-service/        # Media management service
├── user-permission-gateway/ # Permission gateway
└── package.json           # Root workspace config
```

## 🔧 Development Commands

### Shared Common Library
```bash
# Watch mode - tự động rebuild khi có thay đổi
yarn dev:shared

# Build một lần
cd shared-common && yarn build

# Clean build artifacts
cd shared-common && yarn clean
```

### Individual Services
```bash
# Start từng service riêng lẻ
make dev-main      # Main service
make dev-auth      # Auth service  
make dev-medias    # Medias service
make dev-gateway   # Permission gateway
```

### All Services Together
```bash
# Start tất cả services (không bao gồm shared-common)
yarn dev:services

# Start tất cả services (bao gồm shared-common)
yarn dev:all
```

## 🐳 Docker Commands

### Development Mode
```bash
make up-dev       # Start với hot reload
make down-dev     # Stop development services
make logs         # Xem logs
```

### Production Mode  
```bash
make up-prod      # Start production mode
make down-prod    # Stop production services
```

## 🔄 How It Works

### TypeScript Project References
- **shared-common** được cấu hình như một TypeScript project riêng biệt
- Các service khác reference đến shared-common thông qua `tsconfig.json`
- Không cần build shared-common thành JavaScript

### Watch Mode
- **shared-common** chạy `tsc --build --watch` để tự động rebuild
- Các service khác chạy `nest start --watch` để tự động restart
- Khi shared-common thay đổi → TypeScript tự động rebuild → Services tự động restart

### Concurrently
- Chạy nhiều processes cùng lúc trong 1 terminal
- Mỗi service có màu sắc riêng trong logs
- Ctrl+C để stop tất cả services

## 🛠️ Troubleshooting

### Lỗi Module Resolution
```bash
# Clean và rebuild tất cả
yarn clean
yarn build

# Hoặc clean từng service
cd shared-common && yarn clean
cd auth-service && rm -rf dist
cd main-service && rm -rf dist
```

### Lỗi Dependencies
```bash
# Reinstall tất cả dependencies
yarn install

# Hoặc từng service
cd shared-common && yarn install
cd auth-service && yarn install
```

### Port Conflicts
```bash
# Kiểm tra ports đang sử dụng
lsof -i :3000  # Main service
lsof -i :3001  # Medias service  
lsof -i :3002  # Auth service
lsof -i :3004  # Permission gateway
```

## 📝 Best Practices

### 1. Development Workflow
1. **Luôn start shared-common trước**: `yarn dev:shared`
2. **Sau đó start các services**: `yarn dev:services` hoặc `make dev`
3. **Edit code trong shared-common** → Tự động rebuild → Services tự động restart

### 2. Code Changes
- **Shared-common**: Edit trực tiếp TypeScript files
- **Services**: Edit TypeScript files, NestJS sẽ auto-reload
- **Không cần build manual** shared-common trong development

### 3. Git Workflow
- Commit changes trong shared-common và services riêng biệt
- Shared-common changes nên được test với tất cả services

## 🎯 Benefits

### ✅ **Không cần build manual**
- Shared-common tự động rebuild khi có changes
- Services tự động restart khi nhận được updates

### ✅ **Fast development**
- Chỉ cần 1 lệnh để start tất cả
- Hot reload cho tất cả services
- TypeScript project references cho better performance

### ✅ **Easy debugging**
- Tất cả logs trong 1 terminal
- Màu sắc riêng cho từng service
- Dễ dàng identify issues

### ✅ **Production ready**
- Docker setup cho production
- Separate development và production configs
- Proper dependency management
