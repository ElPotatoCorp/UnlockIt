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

export async function duplicatedEntryPipe<T extends ObjectLiteral>(
  repository: Repository<T>,
  uniqueFields: (keyof T)[] = ['id'],
  value: any,
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
