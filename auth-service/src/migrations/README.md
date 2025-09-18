# Auth Service Migrations

Auth service không cần migrations vì:

- Không có database entities riêng
- Chỉ handle authentication logic
- User data được quản lý bởi Main Service

## Database Access

Auth service chỉ cần:

- Read user data từ Main Service qua API
- Không có direct database access
- JWT tokens được lưu trong memory hoặc Redis (nếu cần)

## Service Communication

Auth service giao tiếp với:

- **Main Service**: Để lấy user data cho authentication
- **Medias Service**: Để verify JWT tokens
- **Frontend**: Để cung cấp authentication endpoints
