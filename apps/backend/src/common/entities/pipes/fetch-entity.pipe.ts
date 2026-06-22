import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { mixin } from '@nestjs/common';
import { buildNotFoundMessage, buildWhere } from '../utils/helper';

/**
 * Fetches an entity matching the given fields/values.
 * Throws a formatted `NotFoundException` if not found.
 * Optionally accepts `FindOneOptions` (excluding `where`) to load relations,
 * select specific columns, etc.
 */
export async function fetchEntityOrFail<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: FindOneOptions<T>,
): Promise<T> {
  const entity = await repository.findOne(options);

  if (!entity) {
    throw new NotFoundException(
      buildNotFoundMessage(
        repository,
        (options.where as FindOptionsWhere<T>) ?? {},
      ),
    );
  }

  return entity;
}

/**
 * Validates that an entity identified by `field` exists **and returns it**.
 * Throws a formatted `NotFoundException` if not found.
 * Accepts optional `FindOneOptions` (excluding `where`) to load relations,
 * select columns, etc.
 *
 * Use this when the route needs the full entity (or parts of it) downstream.
 *
 * @example
 * ```ts
 * // Existence only, no relations
 * @Param('id', EntityFetchPipe(GameEntity)) game: GameEntity
 * ```
 *
 * @example
 * ```ts
 * // With relations
 * @Param('id', EntityFetchPipe(GameEntity, 'id', {
 *   relations: { tags: true, developers: true },
 * })) game: GameEntity
 * ```
 */
export function EntityFetchPipe<T extends ObjectLiteral>(
  entityClass: Type<T>,
  field: keyof T = 'id',
  options?: Omit<FindOneOptions<T>, 'where'>,
): Type<PipeTransform> {
  @Injectable()
  class EntityFetchMixin implements PipeTransform {
    constructor(private readonly dataSource: DataSource) {}

    async transform(value: unknown, _metadata: ArgumentMetadata): Promise<T> {
      const where = buildWhere<T>([field], [value]);
      return fetchEntityOrFail(this.dataSource.getRepository(entityClass), {
        where,
        ...options,
      });
    }
  }

  return mixin(EntityFetchMixin);
}
