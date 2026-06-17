import { Injectable} from '@nestjs/common';
import { FindOneOptions, ObjectLiteral, Repository } from 'typeorm';
import { entityExists, fetchEntityOrFail } from './pipes/entity.pipe';
import { PaginationService } from './pagination/pagination.service';


@Injectable()
export class CommonService {
  public readonly pagination = new PaginationService();

  public readonly entities = {
    async fetchEntityOrFail<T extends ObjectLiteral>(
      repository: Repository<T>,
      options: FindOneOptions<T>,
    ): Promise<T> {
      return fetchEntityOrFail(repository, options);
    },

    async entityExists<T extends ObjectLiteral>(
      repository: Repository<T>,
      options: FindOneOptions<T>,
    ): Promise<boolean> {
      return entityExists(repository, options);
    },
  }
}
