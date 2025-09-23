import { IsString, IsOptional } from 'class-validator';

export class CreateMediaTagDto {
  @IsString()
  tagName: string;

  @IsString()
  tagValue: string;
}


export class MediaTagQueryDto {
  @IsOptional()
  @IsString()
  tagName?: string;

  @IsOptional()
  @IsString()
  tagValue?: string;
}
