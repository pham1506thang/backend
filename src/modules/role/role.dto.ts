import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ActionType, DomainType } from 'common/constants/permissions';

export class PermissionDto {
  @IsString()
  domain: DomainType;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  actions: ActionType[];
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
