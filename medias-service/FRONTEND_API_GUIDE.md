# Medias Service - Frontend API Guide

## 🎯 Overview

Medias Service cung cấp API để quản lý media files với 3 loại operations:
- **Cross-category**: Tìm kiếm/filter toàn bộ media
- **Profile**: Quản lý ảnh profile của user
- **General**: Quản lý ảnh chung (cần permissions)

## 🔗 Base URL

```
http://localhost:3001/medias
```

## 📋 API Endpoints

### 1. Cross-category Operations (Shared)

#### Search Media
```http
GET /medias/search?q={query}&category={category}&type={type}&page={page}&limit={limit}
```

**Query Parameters:**
- `q` (string): Search query
- `category` (optional): "profile" | "general"
- `type` (optional): "image" | "audio" | "video"
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```typescript
{
  data: MediaResponseDto[];
  total: number;
}
```

#### Filter Media
```http
GET /medias/filter?category={category}&fileType={type}&userId={userId}&dateFrom={date}&dateTo={date}&search={query}&sortBy={field}&sortOrder={order}&page={page}&limit={limit}
```

#### Get All Tags
```http
GET /medias/tags
```

**Response:**
```typescript
{
  tags: string[];
}
```

#### Get Media by Tag
```http
GET /medias/by-tag/{tagName}?page={page}&limit={limit}
```

#### Serve File
```http
GET /medias/{id}/file?size={size}
GET /medias/{id}/file/{size}
```

**Response:**
```typescript
{
  url: string;
}
```

### 2. Profile Operations

#### Upload Profile Image
```http
POST /medias/profile/upload
Content-Type: multipart/form-data

Body: file (image file)
```

#### Upload Multiple Profile Images
```http
POST /medias/profile/upload-multiple
Content-Type: multipart/form-data

Body: files (array of image files)
```

#### List Profile Images
```http
GET /medias/profile?page={page}&limit={limit}&search={query}&sortBy={field}&sortOrder={order}
```

#### Get Profile Image Details
```http
GET /medias/profile/{id}
```

#### Get Profile Image Sizes
```http
GET /medias/profile/{id}/sizes
```

**Response:**
```typescript
{
  sizes: string[];
}
```

#### Update Profile Image
```http
PUT /medias/profile/{id}
Content-Type: application/json

Body: UpdateMediaDto
```

#### Delete Profile Image
```http
DELETE /medias/profile/{id}
```

#### Search Profile Images
```http
GET /medias/profile/search?q={query}&page={page}&limit={limit}
```

#### Filter Profile Images
```http
GET /medias/profile/filter?search={query}&sortBy={field}&sortOrder={order}&page={page}&limit={limit}
```

#### Get Profile Images by Tag
```http
GET /medias/profile/by-tag/{tagName}?page={page}&limit={limit}
```

#### Serve Profile Image
```http
GET /medias/profile/{id}/file?size={size}
GET /medias/profile/{id}/file/{size}
```

### 3. General Operations

#### Upload General Image
```http
POST /medias/general/upload
Content-Type: multipart/form-data

Body: file (image file)
```

#### Upload Multiple General Images
```http
POST /medias/general/upload-multiple
Content-Type: multipart/form-data

Body: files (array of image files)
```

#### List General Images
```http
GET /medias/general?page={page}&limit={limit}&search={query}&sortBy={field}&sortOrder={order}
```

#### Get General Image Details
```http
GET /medias/general/{id}
```

#### Get General Image Sizes
```http
GET /medias/general/{id}/sizes
```

#### Update General Image
```http
PUT /medias/general/{id}
Content-Type: application/json

Body: UpdateMediaDto
```

#### Delete General Image
```http
DELETE /medias/general/{id}
```

#### Search General Images
```http
GET /medias/general/search?q={query}&page={page}&limit={limit}
```

#### Filter General Images
```http
GET /medias/general/filter?search={query}&sortBy={field}&sortOrder={order}&page={page}&limit={limit}
```

#### Get General Images by Tag
```http
GET /medias/general/by-tag/{tagName}?page={page}&limit={limit}
```

#### Serve General Image
```http
GET /medias/general/{id}/file?size={size}
GET /medias/general/{id}/file/{size}
```

## 📝 TypeScript Interfaces

### MediaResponseDto
```typescript
interface MediaResponseDto {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileType: 'image' | 'audio' | 'video';
  category: 'general' | 'profile';
  size: number;
  width?: number;
  height?: number;
  uploaderId: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### MediaListQueryDto
```typescript
interface MediaListQueryDto {
  search?: string;
  category?: 'general' | 'profile';
  fileType?: 'image' | 'audio' | 'video';
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  tagName?: string;
  tagValue?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
```

### UpdateMediaDto
```typescript
interface UpdateMediaDto {
  originalName?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
}
```

### MediaTagDto
```typescript
interface MediaTagDto {
  id: string;
  mediaId: string;
  tagName: string;
  tagValue: string;
  createdBy: string;
  createdAt: Date;
}
```

### MediaProcessingStatusDto
```typescript
interface MediaProcessingStatusDto {
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
```

## 🔐 Authentication & Permissions

### Headers Required
```http
Authorization: Bearer {jwt_token}
```

### Permission Requirements

#### Profile Operations
- **Authentication**: Required (JWT)
- **Authorization**: User chỉ có thể truy cập ảnh của chính họ
- **No Gateway Permission**: Không cần gateway permission

#### General Operations
- **Authentication**: Required (JWT)
- **Authorization**: Cần gateway permission
- **Permissions**: `medias.upload`, `medias.view`, `medias.edit`, `medias.delete`, `medias.download`

#### Cross-category Operations
- **Authentication**: Required (JWT)
- **Authorization**: Cần gateway permission
- **Permissions**: `medias.view`, `medias.download`

## 📊 Response Examples

### Successful Upload Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "originalName": "profile-pic.jpg",
  "fileName": "123e4567-e89b-12d3-a456-426614174000.jpg",
  "mimeType": "image/jpeg",
  "fileType": "image",
  "category": "profile",
  "size": 2048576,
  "width": 1920,
  "height": 1080,
  "uploaderId": "user-123",
  "isActive": true,
  "metadata": {
    "uploadedAt": "2024-01-15T10:30:00Z",
    "originalSize": 2048576
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Search Response
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "originalName": "profile-pic.jpg",
      "fileName": "123e4567-e89b-12d3-a456-426614174000.jpg",
      "mimeType": "image/jpeg",
      "fileType": "image",
      "category": "profile",
      "size": 2048576,
      "width": 1920,
      "height": 1080,
      "uploaderId": "user-123",
      "isActive": true,
      "metadata": {},
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

### File URL Response
```json
{
  "url": "/medias/profile/2024/01/123e4567-e89b-12d3-a456-426614174000/123e4567-e89b-12d3-a456-426614174000_thumbnail.jpg"
}
```

## 🖼️ Image Sizes

### Available Sizes
- `thumbnail`: 150x150px
- `small`: 300x300px
- `medium`: 600x600px
- `large`: 1200x1200px
- `original`: Original size

### File URL Pattern
```
/medias/{category}/{year}/{month}/{mediaId}/{filename}
```

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Only image files are allowed for profile uploads",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Profile image not found",
  "error": "Not Found"
}
```

## 🚀 Usage Examples

### Upload Profile Image
```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/medias/profile/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const media = await response.json();
```

### Search Media
```typescript
const searchMedia = async (query: string, category?: string) => {
  const params = new URLSearchParams({
    q: query,
    ...(category && { category }),
    page: '1',
    limit: '10'
  });

  const response = await fetch(`/medias/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
};
```

### Get File URL
```typescript
const getFileUrl = async (mediaId: string, size: string = 'original') => {
  const response = await fetch(`/medias/${mediaId}/file/${size}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const { url } = await response.json();
  return url;
};
```

## 📱 Frontend Integration Tips

1. **File Upload**: Sử dụng FormData cho file upload
2. **Image Display**: Sử dụng file URL để hiển thị ảnh
3. **Pagination**: Implement pagination cho list views
4. **Search**: Debounce search input để tránh quá nhiều requests
5. **Error Handling**: Handle các error cases phù hợp
6. **Loading States**: Show loading states cho upload và search
7. **Image Optimization**: Sử dụng appropriate size cho từng use case
8. **Caching**: Cache file URLs để tránh re-fetch

## 🔧 Development Notes

- **CORS**: Đã được configure cho cross-origin requests
- **Rate Limiting**: Có rate limiting cho upload operations
- **File Validation**: Server validate file type và size
- **Soft Delete**: Media được soft delete, không xóa thật
- **Date Organization**: Files được organize theo year/month structure
