export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'in'
  | 'nin'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'is_null'
  | 'is_not_null'
  | 'between';

type FilterValue =
  | string
  | number
  | boolean
  | Date
  | Array<string | number | Date>
  | null;

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
