import { plainToInstance, Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  FilterField,
  SortField,
  FilterOperator,
} from '../interfaces/pagination.interface';

export class SortFieldDto implements SortField {
  @IsString()
  field: string;

  @IsString()
  order: 'ascend' | 'descend';
}

export class FilterFieldDto implements FilterField {
  @IsString()
  field: string;

  @IsOptional()
  operator?: FilterOperator;

  @IsOptional()
  value: string | number | boolean | Array<string | number>;
}

function parseJsonArrayToDto<T>(dtoClass: new () => T) {
  return ({ value }: { value: string }) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) return [];
      return plainToInstance(dtoClass, parsed);
    } catch {
      return [];
    }
  };
}

export class PaginationParamsDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @Transform(parseJsonArrayToDto(SortFieldDto))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortFieldDto)
  sorts?: SortFieldDto[];

  @IsOptional()
  @Transform(parseJsonArrayToDto(FilterFieldDto))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterFieldDto)
  filters?: FilterFieldDto[];

  @IsOptional()
  @IsString()
  search?: string;
}
