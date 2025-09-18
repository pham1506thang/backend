# Kế Hoạch Chi Tiết - Module MEDIAS

## Tổng Quan

Module quản lý media files với focus vào images, hỗ trợ multiple sizes, versioning structure, và search/filter capabilities. Được thiết kế để dễ dàng migrate lên S3 trong tương lai.

## 1. Database Schema Design

### 1.1 Media Entity (Core)

```typescript
interface Media {
  id: string;
  originalName: string;
  fileName: string; // unique filename on storage
  mimeType: string;
  fileType: 'image' | 'audio' | 'video'; // focus on image first
  size: number; // bytes
  width?: number; // for images
  height?: number; // for images
  uploaderId: string; // JWTUser.id
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata: Record<string, any>; // flexible metadata storage
}
```

### 1.2 MediaVersion Entity (Versioning Structure)

```typescript
interface MediaVersion {
  id: string;
  mediaId: string;
  version: string; // "1.0.0", "1.1.0", etc.
  fileName: string;
  filePath: string; // relative path on storage
  size: number;
  width?: number;
  height?: number;
  isCurrent: boolean; // only one version can be current
  createdAt: Date;
  createdBy: string; // JWTUser.id
  changeLog?: string; // what changed in this version
}
```

### 1.3 MediaSize Entity (Multiple Sizes)

```typescript
interface MediaSize {
  id: string;
  mediaId: string;
  versionId: string;
  sizeName: string; // 'thumbnail', 'small', 'medium', 'large', 'original'
  fileName: string;
  filePath: string;
  width: number;
  height: number;
  size: number;
  quality?: number; // for compressed versions
  createdAt: Date;
}
```

### 1.4 MediaTag Entity (Search/Filter)

```typescript
interface MediaTag {
  id: string;
  mediaId: string;
  tagName: string;
  tagValue: string;
  createdAt: Date;
  createdBy: string;
}
```

## 2. File Storage Structure

### 2.1 Local Storage (Current) - Images Only

```
/storage/
  /medias/
    /images/
      /{year}/
        /{month}/
          /{mediaId}/
            /versions/
              /{version}/
                /original.{ext}
                /thumbnail.{ext}
                /small.{ext}
                /medium.{ext}
                /large.{ext}
    /audio/
      /{year}/
        /{month}/
          /{mediaId}/
            /versions/
              /{version}/
                /original.{ext}
                /preview.{ext}  # 30s preview
    /video/
      /{year}/
        /{month}/
          /{mediaId}/
            /versions/
              /{version}/
                /original.{ext}
                /thumbnail.{ext}  # video thumbnail
                /preview.{ext}    # 10s preview
                /compressed.{ext} # lower quality version
```

### 2.2 S3 Migration Ready Structure (Future)

```
bucket/
  medias/
    images/
      {year}/{month}/{mediaId}/versions/{version}/
    audio/
      {year}/{month}/{mediaId}/versions/{version}/
    video/
      {year}/{month}/{mediaId}/versions/{version}/
```

## 3. API Endpoints Design

### 3.1 Upload Endpoints

- `POST /medias/upload` - Upload single file
- `POST /medias/upload-multiple` - Upload multiple files
- `POST /medias/upload-with-sizes` - Upload with auto-generate sizes

### 3.2 Management Endpoints

- `GET /medias` - List with pagination, search, filter
- `GET /medias/:id` - Get media details
- `GET /medias/:id/versions` - Get all versions
- `GET /medias/:id/sizes` - Get all sizes for current version
- `PUT /medias/:id` - Update metadata
- `DELETE /medias/:id` - Soft delete media

### 3.3 Versioning Endpoints

- `POST /medias/:id/versions` - Create new version
- `PUT /medias/:id/versions/:versionId` - Update version
- `GET /medias/:id/versions/:versionId` - Get specific version
- `POST /medias/:id/versions/:versionId/activate` - Set as current version

### 3.4 Search/Filter Endpoints

- `GET /medias/search?q=keyword` - Text search
- `GET /medias/filter?type=image&dateFrom=2024-01-01&dateTo=2024-12-31` - Advanced filter
- `GET /medias/tags` - Get all available tags
- `GET /medias/by-tag/:tagName` - Get medias by tag

### 3.5 File Serving Endpoints

- `GET /medias/:id/file` - Serve original file
- `GET /medias/:id/file/:size` - Serve specific size
- `GET /medias/:id/versions/:versionId/file` - Serve specific version
- `GET /medias/:id/versions/:versionId/file/:size` - Serve specific version + size

## 4. Service Layer Architecture

### 4.1 MediaService

- Core CRUD operations
- File upload handling
- Metadata management

### 4.2 MediaVersionService

- Version management
- Version activation
- Change tracking

### 4.3 MediaSizeService

- Size generation (thumbnail, small, medium, large)
- Image processing with sharp
- Quality optimization

### 4.4 MediaSearchService

- Full-text search
- Filter operations
- Tag management

### 4.5 StorageService (Abstract Interface)

- IStorageService interface (for future S3 compatibility)
- LocalStorageService (current implementation)
- S3StorageService (future - interface only)

## 5. Implementation Steps

### Phase 1: Core Setup

1. **Create Module Structure**

   ```bash
   nest g module medias
   nest g controller medias
   nest g service medias
   ```

2. **Database Setup**
   - Create entities with TypeORM
   - Run migrations
   - Set up relationships

3. **Basic Upload**
   - File upload endpoint
   - Local storage implementation
   - Basic metadata saving

### Phase 2: Image Processing

1. **Install Dependencies**

   ```bash
   npm install sharp multer @types/multer
   ```

2. **Size Generation**
   - Thumbnail: 150x150
   - Small: 300x300
   - Medium: 600x600
   - Large: 1200x1200
   - Original: keep as-is

3. **Image Optimization**
   - Quality settings per size
   - Format conversion (WebP support)

### Phase 3: Versioning

1. **Version Management**
   - Version creation
   - Version switching
   - Version history

2. **File Organization**
   - Version-based file structure
   - Cleanup old versions

### Phase 4: Search & Filter

1. **Search Implementation**
   - Full-text search on metadata
   - Tag-based search
   - Date range filtering

2. **Advanced Filtering**
   - File type filtering
   - Size filtering
   - Author filtering

### Phase 5: Future Compatibility (Interface Only)

1. **Storage Interface**
   - IStorageService interface definition
   - S3StorageService interface (empty implementation)
   - Configuration structure for future S3

2. **Audio/Video Structure**
   - Extend MediaSize entity for audio/video variants
   - File path generation for different media types
   - Metadata structure for future audio/video support

## 6. Configuration

### 6.1 Environment Variables

```env
# Storage Configuration (Current)
STORAGE_TYPE=local
STORAGE_PATH=/storage/medias

# S3 Configuration (Future - for interface compatibility)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_REGION=
# S3_BUCKET_NAME=

# Image Processing
IMAGE_QUALITY_THUMBNAIL=80
IMAGE_QUALITY_SMALL=85
IMAGE_QUALITY_MEDIUM=90
IMAGE_QUALITY_LARGE=95
```

### 6.2 Size Configuration

```typescript
// Current implementation - Images only
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, quality: 80 },
  small: { width: 300, height: 300, quality: 85 },
  medium: { width: 600, height: 600, quality: 90 },
  large: { width: 1200, height: 1200, quality: 95 },
  original: { quality: 100 },
};

// Future - Audio/Video variants (interface only)
const AUDIO_VARIANTS = {
  original: { quality: 100 },
  preview: { duration: 30, quality: 80 }, // 30s preview
};

const VIDEO_VARIANTS = {
  original: { quality: 100 },
  thumbnail: { width: 300, height: 200, quality: 80 },
  preview: { duration: 10, quality: 70 }, // 10s preview
  compressed: { quality: 60, maxWidth: 720 },
};
```

## 7. Permissions

### 7.1 Required Permissions

- `medias.upload` - Upload files
- `medias.view` - View files
- `medias.edit` - Edit metadata
- `medias.delete` - Delete files
- `medias.manage_versions` - Manage versions
- `medias.admin` - Full access

## 8. Future Considerations (Interface Only)

### 8.1 Audio/Video Support (Future)

- File structure already defined in storage paths
- Variants configuration ready
- No implementation needed now

### 8.2 S3 Migration (Future)

- IStorageService interface defined
- File path structure compatible
- No migration scripts needed now

### 8.3 Advanced Features (Future)

- CDN integration
- AI-powered tagging
- Duplicate detection
- Batch operations
- API rate limiting
