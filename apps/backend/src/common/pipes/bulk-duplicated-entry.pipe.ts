// common/pipes/bulk-duplicated-entry.pipe.ts

import {
  ArgumentMetadata,
  ConflictException,
  Injectable,
  mixin,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, ObjectLiteral, Repository } from 'typeorm';
import { DuplicatedEntryDto } from '../dto/duplicated-entry.dto';

/**
 * Checks an array of values against a single unique column in one query.
 * Throws a 409 ConflictException listing every duplicate if any are found.
 *
 * @param repository - The TypeORM repository to query against.
 * @param values     - The array of values to check.
 * @param column     - The unique column on the entity to check against.
 */
export async function bulkDuplicatedEntry<T extends ObjectLiteral>(
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
  const error = new DuplicatedEntryDto<T>();

  error.invalidFields = [column];
  error.messages[column] =
    `The following values are already in use: ${duplicates.join(', ')}`;

  throw new ConflictException(error);
}

/**
 * Pipe wrapper around {@link bulkDuplicatedEntry} for declarative use.
 *
 * Usage:
 *   @UsePipes(BulkDuplicatedEntryPipe(StockEntity, 'productKey', 'productKeys'))
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
    constructor(
      @InjectRepository(entity) private readonly repository: Repository<T>,
    ) {}

    async transform(value: any, _metadata: ArgumentMetadata): Promise<any> {
      console.log(value);

      const incoming: unknown[] = value?.[bodyField];

      if (!Array.isArray(incoming) || incoming.length === 0) {
        return value;
      }

      await bulkDuplicatedEntry(this.repository, incoming, column);

      return value;
    }
  }

  return mixin(BulkDuplicatedEntryMixin);
}