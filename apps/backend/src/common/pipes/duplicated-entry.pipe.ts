import {
  ArgumentMetadata,
  ConflictException,
  Injectable,
  mixin,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicatedEntry } from '@unlockit/shared';
import { ObjectLiteral, Repository } from 'typeorm';

export async function duplicatedEntryPipe<T extends ObjectLiteral>(
  repository: Repository<T>,
  uniqueFields: (keyof T)[] = ['id'],
  value: any,
): Promise<void> {
  const errors: DuplicatedEntry<T> = { invalidFields: [], messages: {} };

  for (const field of uniqueFields) {
    const fieldValue = value?.[field];
    
    if (fieldValue === undefined || fieldValue === null) {
      continue;
    }

    const exists = await repository.existsBy({ [field]: fieldValue } as any);

    if (exists) {
      errors.invalidFields.push(field);
      errors.messages[field] = `This ${field.toString()} is already used`;
    }
  }

  if (errors.invalidFields.length > 0) {
    throw new ConflictException(errors);
  }
}

export function DuplicatedEntryPipe<T extends ObjectLiteral>(
  entity: Type<T>,
  uniqueFields: (keyof T)[] = ['id'],
): Type<PipeTransform> {
  @Injectable()
  class EntityExistsMixin implements PipeTransform {
    constructor(
      @InjectRepository(entity) private readonly repository: Repository<T>,
    ) {}

    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
      await duplicatedEntryPipe(this.repository, uniqueFields, value);
      return value;
    }
  }

  return mixin(EntityExistsMixin);
}
