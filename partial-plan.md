# Kế Hoạch Chi Tiết - Module MEDIAS

## Tổng Quan

Module quản lý media files với focus vào images, hỗ trợ multiple sizes (preconfigured), và search/filter capabilities. Được thiết kế để dễ dàng migrate lên S3 trong tương lai.

## 1. Database Schema Design

### 1.1 Media Entity (Core)

```typescript
interface Media {
  id: string;
  originalName: string;
  fileName: string; // unique filename on storage
  mimeType: string;
  fileType: 'image' | 'audio' | 'video'; // focus on image first
  category: 'general' | 'profile'; // general for images/, profile for profile/
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

### 1.2 MediaSize Entity (Preconfigured Sizes)

```typescript
interface MediaSize {
  id: string;
  mediaId: string;
  sizeName: string; // 'thumbnail', 'small', 'medium', 'large', 'original'
  fileName: string;
  filePath: string;
  width: number;
  height: number;
  size: number;
  quality: number; // for compressed versions
  createdAt: Date;
}

// Relationship: Media has many MediaSizes
interface MediaWithSizes extends Media {
  sizes: MediaSize[];
}
```

### 1.3 MediaTag Entity (Search/Filter)

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

**Cấu trúc folder với ngày để tổ chức tốt hơn:**

```
/storage/
  /medias/
    /images/
      /{year}/           # 2024, 2025, etc.
        /{month}/        # 01, 02, ..., 12
          /{mediaId}/    # unique media identifier
            /original.{ext}
            /thumbnail.{ext}
            /small.{ext}
            /medium.{ext}
            /large.{ext}
    /profile/
      /{year}/
        /{month}/
          /{mediaId}/
            /original.{ext}
            /thumbnail.{ext}
            /small.{ext}
            /medium.{ext}
            /large.{ext}
    /audio/
      /{year}/
        /{month}/
          /{mediaId}/
            /original.{ext}
            /preview.{ext}  # 30s preview
    /video/
      /{year}/
        /{month}/
          /{mediaId}/
            /original.{ext}
            /thumbnail.{ext}  # video thumbnail
            /preview.{ext}    # 10s preview
            /compressed.{ext} # lower quality version
```

**Lợi ích của cấu trúc ngày:**
- ✅ Tổ chức files theo thời gian upload
- ✅ Tránh quá nhiều files trong 1 folder (performance)
- ✅ Dễ dàng backup/cleanup theo thời gian
- ✅ Tương thích với S3 migration
- ✅ Scalable khi có nhiều files

### 2.2 S3 Migration Ready Structure (Future)

```
bucket/
  medias/
    images/
      {year}/{month}/{mediaId}/
    profile/
      {year}/{month}/{mediaId}/
    audio/
      {year}/{month}/{mediaId}/
    video/
      {year}/{month}/{mediaId}/
```

## 3. API Endpoints Design

### 3.1 Profile Images Endpoints (`/medias/profile`)

#### Upload
- `POST /medias/profile/upload` - Upload single profile image (auto-generate all sizes)
- `POST /medias/profile/upload-multiple` - Upload multiple profile images

#### Management
- `GET /medias/profile` - List profile images with pagination, search, filter
- `GET /medias/profile/:id` - Get profile image details
- `GET /medias/profile/:id/sizes` - Get all available sizes for profile image
- `PUT /medias/profile/:id` - Update profile image metadata
- `DELETE /medias/profile/:id` - Soft delete profile image

#### Search/Filter
- `GET /medias/profile/search?q=keyword` - Text search in profile images
- `GET /medias/profile/filter?dateFrom=2024-01-01&dateTo=2024-12-31` - Advanced filter
- `GET /medias/profile/by-tag/:tagName` - Get profile images by tag

#### File Serving
- `GET /medias/profile/:id/file` - Serve original profile image
- `GET /medias/profile/:id/file/:size` - Serve specific size (thumbnail, small, medium, large, original)

### 3.2 General Images Endpoints (`/medias/general`)

#### Upload
- `POST /medias/general/upload` - Upload single general image (auto-generate all sizes)
- `POST /medias/general/upload-multiple` - Upload multiple general images

#### Management
- `GET /medias/general` - List general images with pagination, search, filter
- `GET /medias/general/:id` - Get general image details
- `GET /medias/general/:id/sizes` - Get all available sizes for general image
- `PUT /medias/general/:id` - Update general image metadata
- `DELETE /medias/general/:id` - Soft delete general image

#### Search/Filter
- `GET /medias/general/search?q=keyword` - Text search in general images
- `GET /medias/general/filter?type=image&dateFrom=2024-01-01&dateTo=2024-12-31` - Advanced filter
- `GET /medias/general/by-tag/:tagName` - Get general images by tag

#### File Serving
- `GET /medias/general/:id/file` - Serve original general image
- `GET /medias/general/:id/file/:size` - Serve specific size (thumbnail, small, medium, large, original)

### 3.3 Global Endpoints (`/medias`)

#### Search/Filter (Cross-category)
- `GET /medias/search?q=keyword` - Text search across all media
- `GET /medias/filter?category=profile&type=image&dateFrom=2024-01-01&dateTo=2024-12-31` - Advanced filter across categories
- `GET /medias/tags` - Get all available tags across categories
- `GET /medias/by-tag/:tagName` - Get medias by tag across categories

#### File Serving (Cross-category)
- `GET /medias/:id/file` - Serve original file (works for both profile and general)
- `GET /medias/:id/file/:size` - Serve specific size (works for both profile and general)

## 4. Controller Architecture

### 4.1 MediasController (Global)

- **Route**: `/medias`
- **Purpose**: Cross-category operations
- **Endpoints**:
  - `GET /medias/search` - Search across all media
  - `GET /medias/filter` - Filter across categories
  - `GET /medias/tags` - Get all tags
  - `GET /medias/by-tag/:tagName` - Get media by tag
  - `GET /medias/:id/file` - Serve file (any category)
  - `GET /medias/:id/file/:size` - Serve specific size (any category)

### 4.2 ProfileMediasController

- **Route**: `/medias/profile`
- **Purpose**: Profile image specific operations
- **Endpoints**:
  - `POST /medias/profile/upload` - Upload profile image
  - `POST /medias/profile/upload-multiple` - Upload multiple profile images
  - `GET /medias/profile` - List profile images
  - `GET /medias/profile/:id` - Get profile image details
  - `GET /medias/profile/:id/sizes` - Get profile image sizes
  - `PUT /medias/profile/:id` - Update profile image
  - `DELETE /medias/profile/:id` - Delete profile image
  - `GET /medias/profile/search` - Search profile images
  - `GET /medias/profile/filter` - Filter profile images
  - `GET /medias/profile/by-tag/:tagName` - Get profile images by tag
  - `GET /medias/profile/:id/file` - Serve profile image
  - `GET /medias/profile/:id/file/:size` - Serve profile image size

### 4.3 GeneralMediasController

- **Route**: `/medias/general`
- **Purpose**: General image specific operations
- **Endpoints**:
  - `POST /medias/general/upload` - Upload general image
  - `POST /medias/general/upload-multiple` - Upload multiple general images
  - `GET /medias/general` - List general images
  - `GET /medias/general/:id` - Get general image details
  - `GET /medias/general/:id/sizes` - Get general image sizes
  - `PUT /medias/general/:id` - Update general image
  - `DELETE /medias/general/:id` - Delete general image
  - `GET /medias/general/search` - Search general images
  - `GET /medias/general/filter` - Filter general images
  - `GET /medias/general/by-tag/:tagName` - Get general images by tag
  - `GET /medias/general/:id/file` - Serve general image
  - `GET /medias/general/:id/file/:size` - Serve general image size

## 5. Service Layer Architecture

### 5.1 MediaService (Core Service)

- Core CRUD operations
- File upload handling
- Metadata management
- Category management (general/profile)
- Shared business logic

### 5.2 ProfileMediaService

- Profile-specific operations
- Profile image upload handling
- Profile size generation (using PROFILE_IMAGE_SIZES)
- Profile metadata management

### 5.3 GeneralMediaService

- General image operations
- General image upload handling
- General size generation (using IMAGE_SIZES)
- General metadata management

### 5.4 MediaSizeService

- Auto-generate all predefined sizes on upload
- Image processing with sharp
- Quality optimization
- Size configuration management
- Support both profile and general sizes

### 5.5 MediaSearchService

- Full-text search
- Filter operations by category
- Tag management
- Cross-category search

### 5.6 StorageService (Abstract Interface)

- IStorageService interface (for future S3 compatibility)
- LocalStorageService (current implementation)
- S3StorageService (future - interface only)

## 6. Implementation Steps

### Phase 1: Core Setup

1. **Create Module Structure**

   ```bash
   nest g module medias
   nest g controller medias
   nest g controller medias/profile
   nest g controller medias/general
   nest g service medias
   nest g service medias/profile
   nest g service medias/general
   ```

2. **Database Setup**
   - Create entities with TypeORM
   - Run migrations
   - Set up relationships

3. **Storage Path Helper Implementation**
   ```typescript
   // utils/storage-path.util.ts
   export class StoragePathUtil {
     static generateMediaPath(
       category: 'images' | 'profile' | 'audio' | 'video',
       mediaId: string,
       date: Date = new Date()
     ): string {
       const year = date.getFullYear();
       const month = String(date.getMonth() + 1).padStart(2, '0');
       return `${category}/${year}/${month}/${mediaId}`;
     }
   
     static getFullStoragePath(
       category: 'images' | 'profile' | 'audio' | 'video',
       mediaId: string,
       fileName: string,
       date: Date = new Date()
     ): string {
       const basePath = this.generateMediaPath(category, mediaId, date);
       return path.join(process.env.STORAGE_PATH, 'medias', basePath, fileName);
     }
   }
   ```

4. **Basic Upload**
   - File upload endpoints for both profile and general
   - Local storage implementation with date-based paths
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

### Phase 3: Search & Filter

1. **Search Implementation**
   - Full-text search on metadata
   - Tag-based search
   - Date range filtering

2. **Advanced Filtering**
   - File type filtering
   - Size filtering
   - Author filtering

### Phase 4: Future Compatibility (Interface Only)

1. **Storage Interface**
   - IStorageService interface definition
   - S3StorageService interface (empty implementation)
   - Configuration structure for future S3

2. **Audio/Video Structure**
   - Extend MediaSize entity for audio/video variants
   - File path generation for different media types
   - Metadata structure for future audio/video support

## 7. Configuration

### 7.1 Environment Variables

```env
# Storage Configuration (Current)
STORAGE_TYPE=local
STORAGE_PATH=/storage/medias

# Date-based folder structure configuration
ENABLE_DATE_FOLDERS=true
FOLDER_STRUCTURE=year/month  # year/month or year/month/day

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

### 7.2 Size Configuration

```typescript
// Predefined sizes - System managed, not user configurable
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, quality: 80 },
  small: { width: 300, height: 300, quality: 85 },
  medium: { width: 600, height: 600, quality: 90 },
  large: { width: 1200, height: 1200, quality: 95 },
  original: { quality: 100 },
} as const;


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

## 8. Permissions

### 8.1 Required Permissions

- `medias.upload` - Upload files
- `medias.upload_profile` - Upload profile images
- `medias.upload_general` - Upload general images
- `medias.view` - View files
- `medias.edit` - Edit metadata
- `medias.delete` - Delete files
- `medias.download` - Download files
- `medias.admin` - Full access

## 9. Future Considerations (Interface Only)

### 9.1 Audio/Video Support (Future)

- File structure already defined in storage paths
- Variants configuration ready
- No implementation needed now

### 9.2 S3 Migration (Future)

- IStorageService interface defined
- File path structure compatible
- No migration scripts needed now

### 9.3 Advanced Features (Future)

- CDN integration
- AI-powered tagging
- Duplicate detection
- Batch operations
- API rate limiting
- Custom size requests (with admin approval)

### 9.4 Folder Structure Considerations

**Date-based Organization Benefits:**
- **Performance**: Tránh quá nhiều files trong 1 folder (filesystem limit)
- **Maintenance**: Dễ dàng cleanup files cũ theo thời gian
- **Backup**: Backup theo từng tháng/năm
- **S3 Migration**: Cấu trúc tương thích với S3 prefix
- **Monitoring**: Dễ dàng track usage theo thời gian

**Alternative Structures:**
- `year/month/day` - Chi tiết hơn, phù hợp với high-volume
- `year/month` - Cân bằng giữa organization và simplicity
- `year/quarter` - Ít folders hơn, phù hợp với low-volume

**Implementation Notes:**
- Sử dụng `StoragePathUtil` để generate paths consistently
- Support both date-based và flat structure (configurable)
- Ensure backward compatibility khi migrate
