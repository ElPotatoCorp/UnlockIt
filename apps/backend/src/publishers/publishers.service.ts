import { PublisherEntity } from './entities/publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { ConflictException, Injectable } from '@nestjs/common';
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

  async create(dto: CreatePublisherDto): Promise<PublisherEntity> {
    const existing = await this.publisherRepository.findOneBy({
      name: dto.name,
    });
    if (existing)
      throw new ConflictException(`Publisher '${dto.name}' already exists`);
    return this.publisherRepository.save(dto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.publisherRepository,
      paginationQueryDto,
    );
  }

  async update(id: number, dto: UpdatePublisherDto): Promise<void> {
    await this.publisherRepository.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.publisherRepository.delete(id);
  }
}
