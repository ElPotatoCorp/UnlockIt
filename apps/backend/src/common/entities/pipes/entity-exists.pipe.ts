import { Type, PipeTransform, Injectable, ArgumentMetadata, NotFoundException, mixin } from '@nestjs/common';
import { ObjectLiteral, DataSource, Repository, FindOptionsWhere } from 'typeorm';
import { buildNotFoundMessage, buildWhere } from '../utils/helper';

/**
 * Checks whether an entity matching the given fields/values exists.
 * Uses `existsBy` &rarr; no entity is loaded, purely a boolean check.
 */
export async function entityExists<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: FindOptionsWhere<T>,
): Promise<boolean> {
  return repository.existsBy(options);
}

/**
 * Validates that an entity identified by `field` exists.
 * Passes the **raw param value** through unchanged — no entity is returned.
 *
 * Use this when the route only needs the primitive identifier after validation
 * (e.g. DELETE /wishlist/:id — you only need the id, not the full entity).
 *
 * @example
 * ```ts
 * @Param('id', EntityExistsPipe(GameEntity)) gameId: number
 * ```
 */
export function EntityExistsPipe<T extends ObjectLiteral>(
  entityClass: Type<T>,
  field: keyof T = 'id' as keyof T,
): Type<PipeTransform> {
  @Injectable()
  class EntityExistsMixin implements PipeTransform {
    constructor(private readonly dataSource: DataSource) { }

    async transform(value: unknown, _metadata: ArgumentMetadata): Promise<unknown> {
      const repository = this.dataSource.getRepository(entityClass);
      const where = buildWhere<T>([field], [value]);
      const found = await entityExists(repository, where);

      if (!found) {
        throw new NotFoundException(
          buildNotFoundMessage(repository, where),
        );
      }

      return value;
    }
  }

  return mixin(EntityExistsMixin);
}