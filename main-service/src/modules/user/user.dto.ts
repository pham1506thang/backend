import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email?: string;

  @IsArray()
  @IsOptional()
  roles?: string[];
}

export class UpdateUserDTO extends OmitType(CreateUserDTO, [
  'password',
  'username',
  'roles',
] as never[]) {
  @IsString()
  @IsOptional()
  status?: string;
}

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class AssignUserRolesDTO {
  @IsArray()
  @IsOptional()
  roles?: string[];
}
