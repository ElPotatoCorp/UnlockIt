import { Type } from "@nestjs/common";
import { PaginatedDtoDoc } from "src/docs/common/dto/paginated.dto.doc";

export function PaginatedDtoOf<T>(itemType: Type<T>): Type<PaginatedDto<T>> {
  class PaginatedDtoClass implements PaginatedDto<T> {
    @PaginatedDtoDoc.Data(itemType)
    data: T[];

    @PaginatedDtoDoc.Total()
    total: number;

    @PaginatedDtoDoc.Page()
    page: number;

    @PaginatedDtoDoc.Limit()
    limit: number;
  }

  Object.defineProperty(PaginatedDtoClass, 'name', {
    value: `Paginated${itemType.name}Dto`,
  });

  return PaginatedDtoClass;
}

export class PaginatedDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}