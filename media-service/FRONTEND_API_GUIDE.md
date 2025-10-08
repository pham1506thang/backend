# Media Service - Frontend API Guide

## 🎯 Overview

Media Service cung cấp API để quản lý media files với 2 loại operations chính:
- **Profile**: Quản lý ảnh profile của user (chỉ cần JWT auth)
- **General**: Quản lý ảnh chung (cần JWT auth + permissions)

## 🔗 Base URL

```
http://localhost:3001/medias
```

## 📋 API Endpoints

### 1. Profile Operations

#### Upload Profile Image
```http
POST /medias/profile/upload
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

Body: file (image file)
```

**Response:**
```typescript
MediaResponseDto
```

#### Upload Multiple Profile Images
```http
POST /medias/profile/upload-multiple
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

Body: files (array of image files, max 10)
```

**Response:**
```typescript
MediaResponseDto[]
```

#### List Profile Images (Infinite Scroll)
```http
GET /medias/profile?cursor={cursor}&limit={limit}
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `cursor` (optional): Cursor for pagination
- `limit` (optional): Items per page (default: 10)

**Response:**
```typescript
{
  data: MediaResponseDto[];
  nextCursor?: string;
  hasMore: boolean;
}
```

#### Get Profile Image Details
```http
GET /medias/profile/{id}
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
MediaResponseDto
```

#### Get Profile Image Sizes
```http
GET /medias/profile/{id}/sizes
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  sizes: MediaSizeResponseDto[];
}
```

#### Update Profile Image
```http
PUT /medias/profile/{id}
Content-Type: application/json
Authorization: Bearer {jwt_token}

Body: UpdateMediaDto
```

**Response:**
```typescript
MediaResponseDto
```

#### Delete Profile Image
```http
DELETE /medias/profile/{id}
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  message: string;
}
```

### 2. General Operations

#### Upload General Image
```http
POST /medias/general/upload
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

Body: file (image file)
```

**Response:**
```typescript
MediaResponseDto
```

#### Upload Multiple General Images
```http
POST /medias/general/upload-multiple
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

Body: files (array of image files, max 10)
```

**Response:**
```typescript
MediaResponseDto[]
```

#### List General Images (Infinite Scroll)
```http
GET /medias/general?cursor={cursor}&limit={limit}
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `cursor` (optional): Cursor for pagination
- `limit` (optional): Items per page (default: 10)

**Response:**
```typescript
{
  data: MediaResponseDto[];
  nextCursor?: string;
  hasMore: boolean;
}
```

#### Get General Image Details
```http
GET /medias/general/{id}
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
MediaResponseDto
```

#### Get General Image Sizes
```http
GET /medias/general/{id}/sizes
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  sizes: MediaSizeResponseDto[];
}
```

#### Update General Image
```http
PUT /medias/general/{id}
Content-Type: application/json
Authorization: Bearer {jwt_token}

Body: UpdateMediaDto
```

**Response:**
```typescript
MediaResponseDto
```

#### Delete General Image
```http
DELETE /medias/general/{id}
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  message: string;
}
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

### MediaSizeResponseDto
```typescript
interface MediaSizeResponseDto {
  size: string; // 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
  width: number;
  height: number;
  url: string;
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

### InfiniteParamsDto
```typescript
interface InfiniteParamsDto {
  cursor?: string;
  limit?: number;
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
- **Permissions**: 
  - `medias.upload` - Upload images
  - `medias.view` - View images
  - `medias.edit` - Update images
  - `medias.delete` - Delete images

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

### Infinite Scroll Response
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
  "nextCursor": "eyJjcmVhdGVkQXQiOiIyMDI0LTAxLTE1VDEwOjMwOjAwWiIsImlkIjoiMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIn0=",
  "hasMore": true
}
```

### Image Sizes Response
```json
{
  "sizes": [
    {
      "size": "thumbnail",
      "width": 150,
      "height": 150,
      "url": "/medias/profile/2024/01/123e4567-e89b-12d3-a456-426614174000/thumbnail.jpg"
    },
    {
      "size": "small",
      "width": 300,
      "height": 300,
      "url": "/medias/profile/2024/01/123e4567-e89b-12d3-a456-426614174000/small.jpg"
    },
    {
      "size": "original",
      "width": 1920,
      "height": 1080,
      "url": "/medias/profile/2024/01/123e4567-e89b-12d3-a456-426614174000/original.jpg"
    }
  ]
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

### Upload Multiple Images
```typescript
const formData = new FormData();
files.forEach(file => {
  formData.append('files', file);
});

const response = await fetch('/medias/profile/upload-multiple', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const mediaList = await response.json();
```

### Infinite Scroll List
```typescript
const loadImages = async (cursor?: string) => {
  const params = new URLSearchParams({
    limit: '10'
  });
  
  if (cursor) {
    params.append('cursor', cursor);
  }

  const response = await fetch(`/medias/profile?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
};
```

### Get Image Sizes
```typescript
const getImageSizes = async (mediaId: string) => {
  const response = await fetch(`/medias/profile/${mediaId}/sizes`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const { sizes } = await response.json();
  return sizes;
};
```

## 📱 Frontend Integration Tips

1. **File Upload**: Sử dụng FormData cho file upload
2. **Image Display**: Sử dụng file URL từ sizes response để hiển thị ảnh
3. **Infinite Scroll**: Implement infinite scroll với cursor-based pagination
4. **Error Handling**: Handle các error cases phù hợp
5. **Loading States**: Show loading states cho upload và list loading
6. **Image Optimization**: Sử dụng appropriate size cho từng use case
7. **Caching**: Cache file URLs để tránh re-fetch
8. **Multiple Upload**: Support upload multiple files (max 10)

## 🔧 Development Notes

- **CORS**: Đã được configure cho cross-origin requests
- **Rate Limiting**: Có rate limiting cho upload operations
- **File Validation**: Server validate file type và size
- **Soft Delete**: Media được soft delete, không xóa thật
- **Date Organization**: Files được organize theo year/month structure
- **Infinite Scroll**: Sử dụng cursor-based pagination thay vì offset-based
- **Permissions**: General operations cần gateway permissions
