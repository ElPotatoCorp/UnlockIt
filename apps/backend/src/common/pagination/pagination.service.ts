import {
  FindOneOptions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedDto } from './dto/paginated.dto';
import { NotFoundException } from '@nestjs/common';

type TransformEach<T, U> = {
  each?: true; // Transform each by default even when undefined is given
  fn: (entity: T) => U;
};

type TransformAll<T, U> = {
  each: false;
  fn: (entities: T[]) => U;
};

export type PaginatedResponseTransform<T, U> =
  | TransformEach<T, U>
  | TransformAll<T, U>;

export type PaginatedResponseOptions<
  T extends ObjectLiteral,
  U = T,
> = FindOneOptions<T> & {
  transform?: PaginatedResponseTransform<T, U>;
};

export class PaginationService {
  public async getPaginatedResponse<T extends ObjectLiteral, U = T>(
    repository: Repository<T>,
    paginationQueryDto: PaginationQueryDto,
    options?: PaginatedResponseOptions<T, U>,
  ): Promise<PaginatedDto<U>>;

  public async getPaginatedResponse<T extends ObjectLiteral, U = T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationQueryDto: PaginationQueryDto,
    transform?: PaginatedResponseTransform<T, U>,
  ): Promise<PaginatedDto<U>>;

  public async getPaginatedResponse<T extends ObjectLiteral, U = T>(
    repositoryOrQuery: Repository<T> | SelectQueryBuilder<T>,
    paginationQueryDto: PaginationQueryDto,
    optionsOrTransform?:
      | PaginatedResponseOptions<T, U>
      | PaginatedResponseTransform<T, U>,
  ): Promise<PaginatedDto<U>> {
    const { page, limit } = paginationQueryDto;
    const offset = (page - 1) * limit;

    let transform: PaginatedResponseTransform<T, U> | undefined;
    let data: T[];
    let total: number;

    if (repositoryOrQuery instanceof Repository) {
      const { transform: _transform, ...findOptions } = (optionsOrTransform ??
        {}) as PaginatedResponseOptions<T, U>;
      transform = _transform;

      [data, total] = await repositoryOrQuery.findAndCount({
        ...findOptions,
        skip: offset,
        take: limit,
      });
    } else {
      transform = optionsOrTransform as
        | PaginatedResponseTransform<T, U>
        | undefined;

      [data, total] = await repositoryOrQuery
        .skip(offset)
        .take(limit)
        .getManyAndCount();
    }

    if (offset >= total && total > 0) {
      throw new NotFoundException('Page not found');
    }

    let items: U[];
    if (transform) {
      items =
        transform.each === false
          ? (transform.fn(data) as U[])
          : data.map(transform.fn);
    } else {
      items = data as unknown as U[];
    }

    return new PaginatedDto(total, page, limit, items);
  }
}
