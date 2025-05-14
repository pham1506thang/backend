import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActionDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  label: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  code: string;
}

export class UpdateActionDTO extends PartialType(CreateActionDTO) {}
