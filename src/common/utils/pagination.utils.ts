import { FilterField, PaginationResult } from 'common/interfaces/pagination.interface';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function applyFilters<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, filters: FilterField[] = []): SelectQueryBuilder<T> {
  filters.forEach(filter => {
    const operator = filter.operator || 'eq';
    const paramKey = `${filter.field}_param`;
    const field = `${qb.alias}.${filter.field}`;

    switch (operator) {
      case 'eq':
        if (filter.value === null) {
          qb.andWhere(`${field} IS NULL`);
        } else {
          qb.andWhere(`${field} = :${paramKey}`, { [paramKey]: filter.value });
        }
        break;
      case 'neq':
        if (filter.value === null) {
          qb.andWhere(`${field} IS NOT NULL`);
        } else {
          qb.andWhere(`${field} != :${paramKey}`, { [paramKey]: filter.value });
        }
        break;
      case 'contains':
        qb.andWhere(`LOWER(${field}) ILIKE LOWER(:${paramKey})`, { [paramKey]: `%${filter.value}%` });
        break;
      case 'not_contains':
        qb.andWhere(`LOWER(${field}) NOT ILIKE LOWER(:${paramKey})`, { [paramKey]: `%${filter.value}%` });
        break;
      case 'starts_with':
        qb.andWhere(`LOWER(${field}) ILIKE LOWER(:${paramKey})`, { [paramKey]: `${filter.value}%` });
        break;
      case 'ends_with':
        qb.andWhere(`LOWER(${field}) ILIKE LOWER(:${paramKey})`, { [paramKey]: `%${filter.value}` });
        break;
      case 'in':
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          qb.andWhere(`${field} IN (:...${paramKey})`, { [paramKey]: filter.value });
        }
        break;
      case 'nin':
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          qb.andWhere(`${field} NOT IN (:...${paramKey})`, { [paramKey]: filter.value });
        }
        break;
      case 'gt':
        qb.andWhere(`${field} > :${paramKey}`, { [paramKey]: filter.value });
        break;
      case 'gte':
        qb.andWhere(`${field} >= :${paramKey}`, { [paramKey]: filter.value });
        break;
      case 'lt':
        qb.andWhere(`${field} < :${paramKey}`, { [paramKey]: filter.value });
        break;
      case 'lte':
        qb.andWhere(`${field} <= :${paramKey}`, { [paramKey]: filter.value });
        break;
      case 'is_null':
        qb.andWhere(`${field} IS NULL`);
        break;
      case 'is_not_null':
        qb.andWhere(`${field} IS NOT NULL`);
        break;
      case 'between':
        if (Array.isArray(filter.value) && filter.value.length === 2) {
          qb.andWhere(`${field} BETWEEN :${paramKey}_start AND :${paramKey}_end`, {
            [`${paramKey}_start`]: filter.value[0],
            [`${paramKey}_end`]: filter.value[1]
          });
        }
        break;
      default:
        if (filter.value !== null) {
          qb.andWhere(`${field} = :${paramKey}`, { [paramKey]: filter.value });
        }
    }
  });
  return qb;
}

// Hàm áp dụng sort cho QueryBuilder
export function applySorts<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, sorts: { field: string, order: 'ascend' | 'descend' }[] = []): SelectQueryBuilder<T> {
  sorts.forEach(sort => {
    qb.addOrderBy(`${qb.alias}.${sort.field}`, sort.order === 'ascend' ? 'ASC' : 'DESC');
  });
  return qb;
}

export function applySearch<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, search: string, searchFields: string[] = []): SelectQueryBuilder<T> {
  if (search && searchFields.length) {
    const conditions = searchFields.map(field => {
      // Handle numeric fields differently
      if (field.endsWith('id') || field.includes('number') || field.includes('amount')) {
        if (!isNaN(Number(search))) {
          return `CAST(${qb.alias}.${field} AS TEXT) = :exactSearch`;
        }
        return '1=0'; // Always false for non-numeric search on numeric fields
      }
      // Use ILIKE for case-insensitive search on text fields
      return `LOWER(CAST(${qb.alias}.${field} AS TEXT)) ILIKE LOWER(:search)`;
    });

    qb.andWhere(`(${conditions.join(' OR ')})`, {
      search: `%${search}%`,
      exactSearch: search
    });
  }
  return qb;
}

export async function buildPaginationResponse<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  params: PaginationParamsDto
): Promise<PaginationResult<T>> {
  const [data, total] = await qb
    .skip((params.page - 1) * params.limit)
    .take(params.limit)
    .getManyAndCount();
  return {
    data,
    meta: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit)
    }
  };
}