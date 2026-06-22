import { Injectable } from '@nestjs/common';
import { PaginationService } from './pagination/pagination.service';
import { EntitiesService } from './entities/entities.service';

@Injectable()
export class CommonService {
  public readonly pagination = new PaginationService();
  public readonly entities = new EntitiesService();
}
