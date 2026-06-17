import {
  ArgumentMetadata,
  Injectable,
  mixin,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, ObjectLiteral, Repository } from 'typeorm';
import { DuplicatedEntryException } from '../../dto/duplicated-entry.dto';

/**
 * Checks an array of values against a single unique column in one query.
 * Throws a 409 ConflictException listing every duplicate if any are found.
 *
 * @param repository - The TypeORM repository to query against.
 * @param values     - The array of values to check.
 * @param column     - The unique column on the entity to check against.
 */
export async function manyFailIfDuplicated<T extends ObjectLiteral>(
  repository: Repository<T>,
  values: unknown[],
  column: keyof T,
): Promise<void> {
  if (values.length === 0) {
    return;
  }

  const existing = await repository.find({
    where: { [column]: In(values) } as any,
    select: { [column]: true } as any,
  });

  if (existing.length === 0) {
    return;
  }

  const duplicates = existing.map((row) => String(row[column]));

  throw new DuplicatedEntryException<T>(
    [column],
    Object.fromEntries([
      [column],
      [`The following values are already in use: ${duplicates.join(', ')}`],
    ]),
  );
}

/**
 * Pipe wrapper around {@link manyFailIfDuplicated} for declarative use.
 *
 * Usage:
 *   `@Body(BulkDuplicatedEntryPipe(StockEntity, 'productKey', 'productKeys'))`
 *
 * @todo Rework it because it sucks right now
 *
 * @param entity    - The TypeORM entity class to query against.
 * @param column    - The unique column on the entity to check against.
 * @param bodyField - The key on the incoming DTO that holds the array of values.
 */
export function BulkDuplicatedEntryPipe<T extends ObjectLiteral>(
  entity: Type<T>,
  column: keyof T,
  bodyField: string,
): Type<PipeTransform> {
  @Injectable()
  class BulkDuplicatedEntryMixin implements PipeTransform {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    async transform(value: any, _metadata: ArgumentMetadata): Promise<any> {
      const incoming: unknown[] = value?.[bodyField];

      if (!Array.isArray(incoming) || incoming.length === 0) {
        return value;
      }

      await manyFailIfDuplicated(
        this.dataSource.getRepository(entity),
        incoming,
        column,
      );

      return value;
    }
  }

  return mixin(BulkDuplicatedEntryMixin);
}
