# User Permission Gateway Service

Service trung gian để kiểm tra permission của user thông qua message pattern với caching in-memory.

## Kiến trúc

```
Service A (Controller) 
    ↓ (Message Pattern)
User Permission Gateway 
    ↓ (Message Pattern)  
Main Service (User with Permissions)
```

## Tính năng

- ✅ Kiểm tra permission thông qua message pattern
- ✅ In-memory cache với TTL (5 phút mặc định)
- ✅ Cache invalidation theo user ID
- ✅ Giao tiếp với main-service qua RabbitMQ
- ✅ Không phụ thuộc database

## Cài đặt

```bash
npm install
```

## Cấu hình

### 1. Biến môi trường chung (root .env)
Tạo file `.env` ở root project với các biến chung:

```env
# Common Environment Variables
NODE_ENV=development

# RabbitMQ (shared across all services)
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672

# JWT (shared across auth services)
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=24h

# Service URLs (for inter-service communication)
MAIN_SERVICE_URL=http://main-service:3000
AUTH_SERVICE_URL=http://auth-service:3002
MEDIAS_SERVICE_URL=http://medias-service:3001
USER_PERMISSION_GATEWAY_URL=http://user-permission-gateway:3004

# API Keys (for inter-service authentication)
MAIN_SERVICE_API_KEY=your-api-key-here
AUTH_SERVICE_API_KEY=your-api-key-here
MEDIAS_SERVICE_API_KEY=your-api-key-here
USER_PERMISSION_GATEWAY_API_KEY=your-api-key-here
```

### 2. Biến môi trường riêng (user-permission-gateway/.env)
Copy file `env.example` thành `.env` trong thư mục service:

```env
# Service-specific Configuration
USER_PERMISSION_GATEWAY_QUEUE=user_permission_gateway_queue
MAIN_SERVICE_QUEUE=main_service_queue

# Cache Configuration
CACHE_TTL=300
CACHE_MAX_ITEMS=10000
```

### 3. Thứ tự ưu tiên biến môi trường

#### Development (Local)
Service sẽ load biến môi trường theo thứ tự:
1. `user-permission-gateway/.env` (ưu tiên cao nhất)
2. `../.env` (root project)
3. System environment variables

#### Production (Docker)
Docker sẽ inject biến môi trường trực tiếp vào container, không cần load từ file .env.

**Lưu ý**: 
- Biến môi trường chung như `RABBITMQ_URL`, `NODE_ENV` nên để ở root `.env` để tất cả service đều sử dụng chung
- Trong Docker, biến môi trường được inject qua `docker-compose.yml` hoặc `Dockerfile`

## Chạy service

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Message Patterns

### Incoming (Service gọi đến)

- `user_permission_check`: Kiểm tra permission
- `user_permission_invalidate_cache`: Xóa cache của user

### Outgoing (Gọi đến Main Service)

- `user_permission_get_by_user_id`: Lấy thông tin user với permissions
- `user_roles_get_by_user_id`: Lấy roles của user
- `roles_get_all`: Lấy tất cả roles
- `permissions_get_all`: Lấy tất cả permissions

## Cách sử dụng

### 1. Từ service khác (Controller)

```typescript
// Trong controller của service khác
@Controller()
export class SomeController {
  constructor(
    @Inject('USER_PERMISSION_GATEWAY_CLIENT') 
    private userPermissionClient: ClientProxy
  ) {}

  @Get()
  async someEndpoint() {
    // Kiểm tra permission
    const result = await this.userPermissionClient
      .send('user_permission_check', {
        userId: 'user123',
        permission: 'read:users',
        resource: 'users'
      })
      .toPromise();

    if (!result.hasPermission) {
      throw new ForbiddenException('Access denied');
    }

    // Logic tiếp theo...
  }
}
```

### 2. Invalidate cache

```typescript
// Khi user permissions thay đổi
await this.userPermissionClient
  .send('user_permission_invalidate_cache', {
    userId: 'user123'
  })
  .toPromise();
```

## Cache Strategy

- **Key format**: `user_permissions:{userId}`
- **TTL**: 5 phút (có thể cấu hình)
- **Max items**: 10,000 (có thể cấu hình)
- **Eviction**: LRU khi đạt max items

## Monitoring

Service cung cấp cache stats qua `CacheService.getStats()`:

```typescript
{
  size: 150,
  maxSize: 10000,
  ttl: 300
}
```