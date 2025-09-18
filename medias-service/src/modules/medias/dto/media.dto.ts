import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsObject,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMediaDto {
  @IsString()
  originalName: string;

  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsEnum(['image', 'audio', 'video', 'document', 'other'])
  fileType: 'image' | 'audio' | 'video' | 'document' | 'other';

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
  fileType: 'image' | 'audio' | 'video' | 'document' | 'other';
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
  @IsEnum(['image', 'audio', 'video'])
  fileType?: 'image' | 'audio' | 'video';

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
