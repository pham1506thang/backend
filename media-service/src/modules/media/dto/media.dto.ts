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
import { MEDIA_FILE_TYPES, MEDIA_CATEGORIES } from '../../../common/constants/image-sizes';

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
  @IsNumber()
  @Min(0)
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  originalName?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class MediaResponseDto {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileType: typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES];
  category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES];
  size: number;
  width?: number;
  height?: number;
  uploaderId: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
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
