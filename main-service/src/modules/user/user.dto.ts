import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PickType } from '@nestjs/mapped-types';

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
  firstName?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  thumbnailAvatarUrl?: string;

  @IsArray()
  @IsOptional()
  roles?: string[];
}

export class UpdateUserDTO extends PickType(CreateUserDTO, [
  'firstName',
  'lastName',
  'email',
  'avatarUrl',
  'thumbnailAvatarUrl',
]) {
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
