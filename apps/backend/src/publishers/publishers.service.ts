import { PublisherEntity } from './entities/publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(PublisherEntity)
    private readonly publisherRepository: Repository<PublisherEntity>,
    private readonly commonService: CommonService,
  ) {}

  async create(
    createPublisherDto: CreatePublisherDto,
  ): Promise<PublisherEntity> {
    const publisher = this.publisherRepository.create(createPublisherDto);
    return this.publisherRepository.save(createPublisherDto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.publisherRepository,
      paginationQueryDto,
    );
  }

  async update(
    id: number,
    updatePublisherDto: UpdatePublisherDto,
  ): Promise<void> {
    await this.publisherRepository.update(id, updatePublisherDto);
  }

  async remove(id: number): Promise<void> {
    await this.publisherRepository.delete(id);
  }
}
