export type SortDirection = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  dir?: SortDirection;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
