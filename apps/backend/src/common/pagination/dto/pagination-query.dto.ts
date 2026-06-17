import { ExactData, PaginationQuery } from '@unlockit/shared';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PaginationQueryDtoDoc } from 'src/docs/common/dto/pagination-query.dto.doc';

export class PaginationQueryDto implements PaginationQuery {
  @PaginationQueryDtoDoc.Page()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @PaginationQueryDtoDoc.Limit()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}

const _assertExact: ExactData<PaginationQuery, PaginationQueryDto> = true;
