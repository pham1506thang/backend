import { IsString, IsNotEmpty, IsArray, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
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
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  email?: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value ? value.map((id: string) => new Types.ObjectId(id)) : [])
  roles?: Types.ObjectId[];
}

export class UpdateUserDTO extends OmitType(CreateUserDTO, ['password', 'username'] as const) {}

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
} 