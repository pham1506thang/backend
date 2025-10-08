import { plainToInstance, Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsArray,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SortField, FilterField } from '../interfaces/pagination.interface';

export class InfiniteSortFieldDto implements SortField {
  @IsString()
  field: SortField['field'];

  @IsString()
  @IsIn(['ascend', 'descend'])
  order: SortField['order'];
}

export class InfiniteFilterFieldDto implements FilterField {
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

export class InfiniteParamsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20; // Default limit

  @IsOptional()
  @IsString()
  cursor?: string; // Base64 encoded composite cursor

  @IsOptional()
  @IsString()
  search?: string; // Global search

  @IsOptional()
  @Transform(parseJsonArrayToDto(InfiniteFilterFieldDto))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InfiniteFilterFieldDto)
  filters?: InfiniteFilterFieldDto[];

  @IsOptional()
  @Transform(parseJsonArrayToDto(InfiniteSortFieldDto))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InfiniteSortFieldDto)
  sorts?: InfiniteSortFieldDto[]; // Multi-field sorting

  @IsOptional()
  @IsString()
  @IsIn(['next', 'prev'])
  direction?: 'next' | 'prev' = 'next'; // Pagination direction
}
