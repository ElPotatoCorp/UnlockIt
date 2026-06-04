export type PaginationQuery = {
  page: number;
  limit: number;
};

export type Paginated<T> = {
  total: number;
  page: number;
  limit: number;
  data: T[];
};