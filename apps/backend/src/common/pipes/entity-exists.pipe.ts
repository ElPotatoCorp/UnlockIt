import {
  ArgumentMetadata,
  Injectable,
  mixin,
  NotFoundException,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';

export async function entityExists<T extends ObjectLiteral>(
  repository: Repository<T>,
  fieldName: keyof T = 'id' as keyof T,
  value: any,
): Promise<T> {
  const entity = await repository.findOne({
    where: { [fieldName]: value } as any,
  });

  if (!entity) {
    throw new NotFoundException(
      `${repository.metadata.name} with ${String(fieldName)} '${value}' not found`,
    );
  }

  return entity;
}

export function EntityExistsPipe<T extends ObjectLiteral>(
  entity: Type<T>,
  field: keyof T = 'id' as keyof T,
): Type<PipeTransform> {
  @Injectable()
  class EntityExistsMixin implements PipeTransform {
    constructor(
      @InjectRepository(entity) private readonly repository: Repository<T>,
    ) {}

    async transform(value: any, metadata: ArgumentMetadata): Promise<T> {
      return entityExists(this.repository, field, value);
    }
  }

  return mixin(EntityExistsMixin);
}
