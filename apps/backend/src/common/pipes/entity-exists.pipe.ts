import {
  ArgumentMetadata,
  Injectable,
  mixin,
  NotFoundException,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';

export async function entityExists<T extends ObjectLiteral>(
  repository: Repository<T>,
  fieldNames: (keyof T)[] = ['id'],
  values: any[],
  interrupt: boolean = false,
): Promise<T | null> {
  const entity = await repository.findOne({
    where: Object.fromEntries(
      fieldNames.map((key, idx) => [[key], values[idx]]),
    ),
  });

  if (interrupt === true && !entity) {
    throw new NotFoundException(
      `${repository.metadata.name.replace('Entity', '')} with field(s) (${fieldNames.map((key) => `'${String(key)}'`).join(', ')}) and value(s) (${values.map((value) => `'${String(value)}'`).join(', ')}) not found`,
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
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    async transform(value: any, _metadata: ArgumentMetadata): Promise<T> {
      return entityExists(
        this.dataSource.getRepository(entity),
        [field],
        [value],
        true,
      ) as unknown as T;
    }
  }

  return mixin(EntityExistsMixin);
}
