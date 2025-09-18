import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateMediaVersionDto {
  @IsString()
  version: string; // "1.0.0", "1.1.0", etc.

  @IsString()
  fileName: string;

  @IsString()
  filePath: string;

  @IsOptional()
  @IsString()
  changeLog?: string;
}

export class UpdateMediaVersionDto {
  @IsOptional()
  @IsString()
  changeLog?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}

export class MediaVersionResponseDto {
  id: string;
  mediaId: string;
  version: string;
  fileName: string;
  filePath: string;
  size: number;
  width?: number;
  height?: number;
  isCurrent: boolean;
  createdBy: string;
  changeLog?: string;
  createdAt: Date;
}

export class ActivateVersionDto {
  @IsUUID()
  versionId: string;
}
