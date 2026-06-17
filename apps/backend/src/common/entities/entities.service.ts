import { ObjectLiteral, Repository, FindOneOptions } from 'typeorm';
import { fetchEntityOrFail } from './pipes/fetch-entity.pipe';
import { failIfDuplicated } from './pipes/duplicated-entry.pipe';
import { entityExists } from './pipes/entity-exists.pipe';
import { manyFailIfDuplicated } from './pipes/bulk-duplicated-entry.pipe';

export class EntitiesService {
  public entityExists<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: FindOneOptions<T>,
  ): Promise<boolean> {
    return entityExists(repository, options);
  }

  public fetchEntityOrFail<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: FindOneOptions<T>,
  ): Promise<T> {
    return fetchEntityOrFail(repository, options);
  }

  public failIfDuplicated<T extends ObjectLiteral>(
    repository: Repository<T>,
    value: any,
    ...uniqueFields: (keyof T)[]
  ): Promise<void> {
    return failIfDuplicated(repository, value, ...uniqueFields);
  }

  public manyFailIfDuplicated<T extends ObjectLiteral>(
    repository: Repository<T>,
    values: unknown[],
    column: keyof T,
  ): Promise<void> {
    return manyFailIfDuplicated(repository, values, column);
  }
}