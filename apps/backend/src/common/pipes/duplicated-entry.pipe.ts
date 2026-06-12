import {
  ArgumentMetadata,
  ConflictException,
  Injectable,
  mixin,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { DuplicatedEntryDto } from '../dto/duplicated-entry.dto';

/**
 * Checks a single value against a single unique column in one query.
 * Throws a 409 ConflictException listing every duplicated fields if any are found.
 *
 * @param repository   - The TypeORM repository to query against.
 * @param values       - The array of values to check.
 * @param uniqueFields - The unique columns on the entity to check against.
 */
export async function duplicatedEntryPipe<T extends ObjectLiteral>(
  repository: Repository<T>,
  value: any,
  ...uniqueFields: (keyof T)[]
): Promise<void> {
  const errors = new DuplicatedEntryDto<T>();

  for (const field of uniqueFields) {
    const fieldValue = value?.[field];

    if (fieldValue === undefined || fieldValue === null) {
      continue;
    }

    const exists = await repository.existsBy({ [field]: fieldValue } as any);

    if (exists) {
      errors.invalidFields.push(field);
      errors.messages[field] =
        `The value \`${fieldValue}\` of field \`${field.toString()}\` is already used`;
    }
  }

  if (errors.invalidFields.length > 0) {
    throw new ConflictException(errors);
  }
}

/**
 * Pipe wrapper around {@link duplicatedEntryPipe} for declarative use.
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
    constructor(
      @InjectRepository(entity) private readonly repository: Repository<T>,
    ) { }

    async transform(value: any, _metadata: ArgumentMetadata): Promise<any> {
      await duplicatedEntryPipe(this.repository, value, ...uniqueFields);
      return value;
    }
  }

  return mixin(DuplicatedEntryMixin);
}
