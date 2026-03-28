import { PaginatedDtoDoc } from "src/docs/common/dto/paginated.dto.doc";

export class PaginatedDto<T> {
  @PaginatedDtoDoc.Total()
  total: number;
  @PaginatedDtoDoc.Page()
  page: number;
  @PaginatedDtoDoc.Limit()
  limit: number;
  @PaginatedDtoDoc.Data()
  data: T[];

  constructor(total: number, page: number, limit: number, data: T[]) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}