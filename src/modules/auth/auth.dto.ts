import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDTO {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email?: string;
}

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
