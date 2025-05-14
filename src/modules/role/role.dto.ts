import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class PermissionDto {
  @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value as string))
  domain: Types.ObjectId;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @Transform(({ value }) => value.map((id: string) => new Types.ObjectId(id)))
  actions: Types.ObjectId[];
}

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  label: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  code: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  priority: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}
