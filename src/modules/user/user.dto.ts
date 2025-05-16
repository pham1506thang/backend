import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value ? value.map((id: string) => new Types.ObjectId(id)) : [])
  roleIds?: Types.ObjectId[];
}

export class UpdateUserDTO {
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value ? value.map((id: string) => new Types.ObjectId(id)) : [])
  roleIds?: Types.ObjectId[];
} 