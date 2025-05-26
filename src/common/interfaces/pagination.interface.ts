import { Types } from "mongoose";

export type FilterOperator = 'eq' | 'neq' | 'contains' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte';
type FilterValue = Types.ObjectId | string | number | boolean | Array<Types.ObjectId | string | number>;

export interface FilterField {
  field: string;
  operator?: FilterOperator;
  value: FilterValue;
}

type SortOrder = 'ascend' | 'descend';

export interface SortField {
  field: string;
  order: SortOrder;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}