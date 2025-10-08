export interface CompositeCursor {
  // Primary sort field values
  values: Record<string, any>; // { createdAt: '2024-01-01T00:00:00Z', id: 'uuid-123' }
  
  // Sort configuration
  sortFields: string[]; // ['createdAt', 'id']
  sortOrders: ('ASC' | 'DESC')[]; // ['DESC', 'ASC']
  
  // Metadata
  timestamp: number; // For cursor expiration
  version: string; // For backward compatibility
}

export interface InfinitePaginationResult<T> {
  data: T[];
  pagination: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextCursor: string | null;
    prevCursor: string | null;
    limit: number;
  };
}
