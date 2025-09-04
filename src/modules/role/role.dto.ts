import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  label: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  code: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => String)
  permissions: string[];
}

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}
