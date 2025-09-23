import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MEDIA_FILE_TYPES, MEDIA_CATEGORIES, MEDIA_PROCESSING_STATUS } from '../../../common/constants/image-sizes';

// Response DTOs
export interface MediaSizeResponseDto {
  sizeName: string;
  fileName: string;
  filePath: string;
  width: number;
  height: number;
  size: number;
  quality?: number;
  url: string;
  createdAt: Date;
}

export interface MediaTagResponseDto {
  id: string;
  tagName: string;
  tagValue: string;
  createdBy: string;
  createdAt: Date;
}

export interface MediaResponseDto {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileExtension: string;
  fileType: typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES];
  category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES];
  size: number;
  quality?: number;
  uploaderId: string;
  isActive: boolean;
  isPublic: boolean;
  altText?: string;
  description?: string;
  processingStatus: typeof MEDIA_PROCESSING_STATUS[keyof typeof MEDIA_PROCESSING_STATUS];
  metadata: Record<string, any>;
  sizes: MediaSizeResponseDto[];
  tags: MediaTagResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class CreateMediaDto {
  @IsString()
  originalName: string;

  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsEnum(Object.values(MEDIA_FILE_TYPES))
  fileType: typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES];

  @IsNumber()
  @Min(0)
  size: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  originalName?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}


export class MediaListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Object.values(MEDIA_CATEGORIES))
  category?: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES];

  @IsOptional()
  @IsEnum(Object.values(MEDIA_FILE_TYPES))
  fileType?: typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES];

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  tagName?: string;

  @IsOptional()
  @IsString()
  tagValue?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
