import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { mixin } from '@nestjs/common';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildNotFoundMessage<T extends ObjectLiteral>(
  repository: Repository<T>,
  fields: (keyof T)[],
  values: unknown[],
): string {
  const entity = repository.metadata.name.replace('Entity', '');
  const fieldList = fields.map((f) => `'${String(f)}'`).join(', ');
  const valueList = values.map((v) => `'${String(v)}'`).join(', ');
  const plural = fields.length > 1;

  return (
    `${entity} with field${plural ? 's' : ''} (${fieldList}) ` +
    `and value${plural ? 's' : ''} (${valueList}) not found`
  );
}

function buildWhere<T extends ObjectLiteral>(
  fields: (keyof T)[],
  values: unknown[],
): FindOptionsWhere<T> {
  return Object.fromEntries(
    fields.map((key, idx) => [key, values[idx]]),
  ) as FindOptionsWhere<T>;
}

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/**
 * Checks whether an entity matching the given fields/values exists.
 * Uses `existsBy` &rarr; no entity is loaded, purely a boolean check.
 */
export async function entityExists<T extends ObjectLiteral>(
  repository: Repository<T>,
  fields: (keyof T)[],
  values: unknown[],
): Promise<boolean> {
  return repository.existsBy(buildWhere(fields, values));
}

/**
 * Fetches an entity matching the given fields/values.
 * Throws a formatted `NotFoundException` if not found.
 * Optionally accepts `FindOneOptions` (excluding `where`) to load relations,
 * select specific columns, etc.
 */
export async function fetchEntityOrFail<T extends ObjectLiteral>(
  repository: Repository<T>,
  fields: (keyof T)[],
  values: unknown[],
  options?: Omit<FindOneOptions<T>, 'where'>,
): Promise<T> {
  const where = buildWhere<T>(fields, values);
  const entity = await repository.findOne({ where, ...options });

  if (!entity) {
    throw new NotFoundException(
      buildNotFoundMessage(repository, fields, values),
    );
  }

  return entity;
}

// ---------------------------------------------------------------------------
// Pipes
// ---------------------------------------------------------------------------

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
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async transform(value: unknown, _metadata: ArgumentMetadata): Promise<unknown> {
      const repository = this.dataSource.getRepository(entityClass);
      const found = await entityExists(repository, [field], [value]);

      if (!found) {
        throw new NotFoundException(
          buildNotFoundMessage(repository, [field], [value]),
        );
      }

      return value;
    }
  }

  return mixin(EntityExistsMixin);
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
  field: keyof T = 'id' as keyof T,
  options?: Omit<FindOneOptions<T>, 'where'>,
): Type<PipeTransform> {
  @Injectable()
  class EntityFetchMixin implements PipeTransform {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async transform(value: unknown, _metadata: ArgumentMetadata): Promise<T> {
      return fetchEntityOrFail(
        this.dataSource.getRepository(entityClass),
        [field],
        [value],
        options,
      );
    }
  }

  return mixin(EntityFetchMixin);
}