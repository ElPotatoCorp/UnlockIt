import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly commonService: CommonService,
  ) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    const existing = await this.tagRepository.findOneBy({ name: dto.name });
    if (existing) throw new ConflictException(`Tag '${dto.name}' already exists`);
    return this.tagRepository.save(dto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(this.tagRepository, paginationQueryDto);
  }

  async update(id: number, dto: UpdateTagDto): Promise<void> {
    await this.tagRepository.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }
}