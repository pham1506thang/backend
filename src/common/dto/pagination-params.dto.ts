import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterField, SortField, FilterOperator } from '../interfaces/pagination.interface';

export class PaginationParamsDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortFieldDto)
  sorts?: SortFieldDto[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterFieldDto)
  filters?: FilterFieldDto[];

  @IsOptional()
  @IsString()
  search?: string;
}

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
