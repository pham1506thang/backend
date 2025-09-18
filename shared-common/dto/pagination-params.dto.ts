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
import { SortField, FilterField } from '../interfaces/pagination.interface';

export class SortFieldDto implements SortField {
  @IsString()
  field: SortField['field'];

  @IsString()
  order: SortField['order'];
}

export class FilterFieldDto implements FilterField {
  @IsString()
  field: FilterField['field'];

  @IsOptional()
  operator?: FilterField['operator'];

  @IsOptional()
  value: FilterField['value'];
}

function parseJsonArrayToDto<T>(dtoClass: new () => T) {
  return ({ value }: { value: string }) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item: any) => plainToInstance(dtoClass, item));
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
