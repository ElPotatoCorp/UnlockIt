import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedDto } from './dto/paginated.dto';
import { entityExists, fetchEntityOrFail } from './pipes/entity.pipe';

interface TransformEach<T, U> {
  each?: true; // Transform each by default even when undefined is given
  fn: (entity: T) => U;
}

interface TransformAll<T, U> {
  each: false;
  fn: (entities: T[]) => U;
}

export type PaginatedResponseTransform<T, U> =
  | TransformEach<T, U>
  | TransformAll<T, U>;

export interface PaginatedResponseOptions<
  T extends ObjectLiteral,
  U = T,
> extends FindOneOptions<T> {
  transform?: PaginatedResponseTransform<T, U>;
}

@Injectable()
export class CommonService {
  public readonly pagination = {
    async getPaginatedResponse<T extends ObjectLiteral, U = T>(
      repository: Repository<T>,
      paginationQueryDto: PaginationQueryDto,
      options?: PaginatedResponseOptions<T, U>,
    ): Promise<PaginatedDto<U>> {
      const { page, limit } = paginationQueryDto;
      const { transform, ...findOptions } = options!;

      const [data, total] = await repository.findAndCount({
        ...findOptions,
        skip: (page - 1) * limit,
        take: limit,
      });

      if ((page - 1) * limit >= total && total > 0) {
        throw new NotFoundException('Page not found');
      }

      let items: U[];
      if (transform) {
        items =
          transform.each === false
            ? [transform.fn(data)]
            : data.map(transform.fn);
      } else {
        items = data as unknown as U[];
      }

      return new PaginatedDto(total, page, limit, items);
    }
  }

  public readonly entities = {
    async fetchEntityOrFail<T extends ObjectLiteral>(
      repository: Repository<T>,
      options: FindOneOptions<T>,
    ): Promise<T> {
      return fetchEntityOrFail(repository, options);
    },

    async entityExists<T extends ObjectLiteral>(
      repository: Repository<T>,
      where: FindOptionsWhere<T>,
    ): Promise<boolean> {
      return entityExists(repository, where);
    },
  }
}
