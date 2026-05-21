import { Paginated } from '@unlockit/shared';
import { IsArray, IsNumber } from 'class-validator';
import { PaginatedDtoDoc } from 'src/docs/common/dto/paginated.dto.doc';

export class PaginatedDto<T> implements Paginated<T> {
  @PaginatedDtoDoc.Total()
  @IsNumber()
  total: number;
  @PaginatedDtoDoc.Page()
  @IsNumber()
  page: number;
  @PaginatedDtoDoc.Limit()
  @IsNumber()
  limit: number;
  @PaginatedDtoDoc.Data()
  @IsArray()
  data: T[];

  constructor(total: number, page: number, limit: number, data: T[]) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
