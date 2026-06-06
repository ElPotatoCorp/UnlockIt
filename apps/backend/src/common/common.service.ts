import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedDto } from './dto/paginated.dto';

export interface PaginatedResponseOptions<T extends ObjectLiteral, U> {
  where?: FindOptionsWhere<T>;
  transform?: (entity: T) => U;
  order?: FindOptionsOrder<T>;
}

@Injectable()
export class CommonService {
  async getPaginatedResponse<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedDto<T>>;

  async getPaginatedResponse<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationQueryDto: PaginationQueryDto,
    options: Omit<PaginatedResponseOptions<T, never>, 'transform'>,
  ): Promise<PaginatedDto<T>>;

  async getPaginatedResponse<T extends ObjectLiteral, U>(
    repository: Repository<T>,
    paginationQueryDto: PaginationQueryDto,
    options: PaginatedResponseOptions<T, U> & { transform: (entity: T) => U },
  ): Promise<PaginatedDto<U>>;

  async getPaginatedResponse<T extends ObjectLiteral, U>(
    repository: Repository<T>,
    paginationQueryDto: PaginationQueryDto,
    options?: PaginatedResponseOptions<T, U>,
  ): Promise<PaginatedDto<T | U>> {
    const { page, limit } = paginationQueryDto;
    const [data, total] = await repository.findAndCount({
      where: options?.where,
      order: options?.order,
      skip: (page - 1) * limit,
      take: limit,
    });

    if ((page - 1) * limit >= total && total > 0) {
      throw new NotFoundException('Page not found');
    }

    const items = options?.transform ? data.map(options.transform) : data;

    return new PaginatedDto(total, page, limit, items as (T | U)[]);
  }
}
