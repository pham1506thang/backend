import { FilterQuery } from 'mongoose';
import { FilterField, FilterOperator, PaginationParams, PaginationResult } from '../interfaces/pagination.interface';

export const convertFiltersToMongoQuery = (filters: FilterField[]): FilterQuery<any> => {
  if (!filters?.length) return {};

  const query: FilterQuery<any> = {};

  filters.forEach(filter => {
    const operator = filter.operator || 'eq';
    switch (operator) {
      case 'eq':
        query[filter.field] = filter.value;
        break;
      case 'neq':
        query[filter.field] = { $ne: filter.value };
        break;
      case 'contains':
        query[filter.field] = { $regex: String(filter.value), $options: 'i' };
        break;
      case 'in':
        query[filter.field] = { $in: filter.value };
        break;
      case 'nin':
        query[filter.field] = { $nin: filter.value };
        break;
      case 'gt':
        query[filter.field] = { $gt: filter.value };
        break;
      case 'gte':
        query[filter.field] = { $gte: filter.value };
        break;
      case 'lt':
        query[filter.field] = { $lt: filter.value };
        break;
      case 'lte':
        query[filter.field] = { $lte: filter.value };
        break;
      default:
        query[filter.field] = filter.value;
    }
  });

  return query;
};

const convertSortParams = (params: PaginationParams) => {
  if (!params.sorts?.length) return {};

  const sort: Record<string, 1 | -1> = {};
  params.sorts.forEach(sortField => {
    sort[sortField.field] = sortField.order === 'ascend' ? 1 : -1;
  });

  return sort;
};

const convertSearchToMongoQuery = (search: string, searchFields: string[]): FilterQuery<any> => {
  if (!search || !searchFields?.length) return {};

  return {
    $or: searchFields.map(field => ({
      [field]: { $regex: search, $options: 'i' }
    }))
  };
};

export const getMongoQueryFromPaginationParams = (
  params: PaginationParams, 
  searchFields: string[] = []
): { query: FilterQuery<any>, sort: Record<string, 1 | -1> } => {
  // Start with base query from filters
  const baseQuery = convertFiltersToMongoQuery(params.filters || []);

  // Add search query if search parameter exists
  const searchQuery = convertSearchToMongoQuery(params.search || '', searchFields);

  // Combine queries
  const query = {
    ...baseQuery,
    ...(Object.keys(searchQuery).length ? searchQuery : {})
  };

  // Get sort parameters
  const sort = convertSortParams(params);

  return { query, sort };
};

export const buildPaginationResponse = <T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginationResult<T> => {
  return {
    data,
    meta: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit)
    }
  };
};