import {
  ArgumentMetadata,
  Injectable,
  mixin,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { DuplicatedEntryException } from '../../dto/duplicated-entry.dto';

/**
 * Checks a single value against a single unique column in one query.
 * Throws a 409 ConflictException listing every duplicated fields if any are found.
 *
 * @param repository   - The TypeORM repository to query against.
 * @param values       - The array of values to check.
 * @param uniqueFields - The unique columns on the entity to check against.
 */
export async function failIfDuplicated<T extends ObjectLiteral>(
  repository: Repository<T>,
  value: any,
  ...uniqueFields: (keyof T)[]
): Promise<void> {
  const invalidFields: (keyof T)[] = [];
  const messages: Partial<Record<keyof T, string>> = {};

  for (const field of uniqueFields) {
    const fieldValue = value?.[field];

    if (fieldValue === undefined || fieldValue === null) {
      continue;
    }

    const exists = await repository.existsBy({ [field]: fieldValue } as any);

    if (exists) {
      invalidFields.push(field);
      messages[field] =
        `The value \`${fieldValue}\` of field \`${String(field)}\` is already used`;
    }
  }

  if (invalidFields.length > 0) {
    throw new DuplicatedEntryException(invalidFields, messages);
  }
}

/**
 * Pipe wrapper around {@link failIfDuplicated} for declarative use.
 *
 * Usage:
 *   @Body(DuplicatedEntryPipe(UserEntity, 'email', 'username'))
 *
 * @param entity       - The TypeORM entity class to query against.
 * @param uniqueFields - The unique columns on the entity to check against.
 */
export function DuplicatedEntryPipe<T extends ObjectLiteral>(
  entity: Type<T>,
  ...uniqueFields: (keyof T)[]
): Type<PipeTransform> {
  @Injectable()
  class DuplicatedEntryMixin implements PipeTransform {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    async transform(value: any, _metadata: ArgumentMetadata): Promise<any> {
      await failIfDuplicated(
        this.dataSource.getRepository(entity),
        value,
        ...uniqueFields,
      );
      return value;
    }
  }

  return mixin(DuplicatedEntryMixin);
}
