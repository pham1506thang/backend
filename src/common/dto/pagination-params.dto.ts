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
import { SortField, FilterField } from 'common/interfaces/pagination.interface';
import { Types } from 'mongoose';

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

function parseJsonArrayToDto<T>(dtoClass: new () => T, objectIdFields: string[] = []) {
  return ({ value }: { value: string }) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) return [];
      const converted = parsed.map((item: any) => {
        objectIdFields.forEach((field) => {
          if (item[field] && Types.ObjectId.isValid(item[field])) {
            item[field] = new Types.ObjectId(item[field]);
          }
        });
        return item;
      });
      return plainToInstance(dtoClass, converted);
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
  @Transform(parseJsonArrayToDto(FilterFieldDto, ['roles']))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterFieldDto)
  filters?: FilterFieldDto[];

  @IsOptional()
  @IsString()
  search?: string;
}
