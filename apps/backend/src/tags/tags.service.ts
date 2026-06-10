import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    private readonly commonService: CommonService,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<TagEntity> {
    const tag = this.tagRepository.create(createTagDto)
    return this.tagRepository.save(tag);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.tagRepository,
      paginationQueryDto,
    );
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<void> {
    await this.tagRepository.update(id, updateTagDto);
  }

  async remove(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
