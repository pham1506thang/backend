import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Action, Domain } from 'common/constants/permissions';

export class PermissionDto {
  @IsString()
  domain: Domain;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  actions: Action[];
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

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}
