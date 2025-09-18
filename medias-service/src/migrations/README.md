# Medias Service Migrations

Medias service chứa migrations cho:

- Media management tables
- File processing tables
- Media versioning tables

## Available Migrations

### setup-media-tables.ts

- Tạo media tables
- Tạo indexes
- Setup media schema

## Usage

```bash
# Run migration
npm run migration:setup-media

# Or with yarn
yarn migration:setup-media
```

## Database Schema

Medias service quản lý database riêng (mediasdb):

- `media` - Media files metadata
- `media_version` - Media versioning
- `media_size` - Multiple file sizes
- `media_tag` - Media tags
- `media_tags_media` - Media-Tag mapping

## Database Connection

- **Host**: medias-db (Docker) / localhost (local)
- **Port**: 5432 (Docker) / 5433 (local)
- **Database**: mediasdb
- **Username**: postgres
- **Password**: postgres
