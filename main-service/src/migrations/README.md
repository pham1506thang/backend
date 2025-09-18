# Main Service Migrations

Main service chứa migrations cho:

- User management
- Role management
- Permission management
- Business logic tables

## Available Migrations

### setup-admin.ts

- Tạo default roles và permissions
- Tạo super admin user
- Setup initial data

## Usage

```bash
# Run migration
npm run migration:setup-admin

# Or with yarn
yarn migration:setup-admin
```

## Database Schema

Main service quản lý database riêng (maindb):

- `users` - User data
- `roles` - Role definitions
- `permissions` - Permission definitions
- `role_permissions` - Role-Permission mapping
- `user_roles` - User-Role mapping

## Database Connection

- **Host**: db (Docker) / localhost (local)
- **Port**: 5432
- **Database**: maindb
- **Username**: postgres
- **Password**: postgres
