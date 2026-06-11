import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedDto } from './dto/paginated.dto';

interface TransformEach<T, U> {
  each?: true;
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
> extends FindManyOptions<T> {
  transform?: PaginatedResponseTransform<T, U>;
}

@Injectable()
export class CommonService {
  async getPaginatedResponse<T extends ObjectLiteral, U = T>(
    repository: Repository<T>,
    paginationQueryDto: PaginationQueryDto,
    options?: PaginatedResponseOptions<T, U>,
  ): Promise<PaginatedDto<U>> {
    const { page, limit } = paginationQueryDto;
    const [data, total] = await repository.findAndCount({
      where: options?.where,
      order: options?.order,
      relations: options?.relations,
      skip: (page - 1) * limit,
      take: limit,
    });

    if ((page - 1) * limit >= total && total > 0) {
      throw new NotFoundException('Page not found');
    }

    let items: U[];
    if (options?.transform) {
      items =
        options.transform.each === false
          ? [options.transform.fn(data)]
          : data.map(options.transform.fn);
    } else {
      items = data as unknown as U[];
    }

    return new PaginatedDto(total, page, limit, items);
  }
}
