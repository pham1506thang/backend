import { IsString, IsNotEmpty, IsArray, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value ? value.map((id: string) => new Types.ObjectId(id)) : [])
  roles?: Types.ObjectId[];
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value ? value.map((id: string) => new Types.ObjectId(id)) : [])
  roleIds?: Types.ObjectId[];
} 