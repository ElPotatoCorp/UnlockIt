import { Injectable } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { DeveloperEntity } from './entities/developer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(DeveloperEntity)
    private readonly developerRepository: Repository<DeveloperEntity>,
    private readonly commonService: CommonService,
  ) {}

  async create(dto: CreateDeveloperDto): Promise<DeveloperEntity> {
    return this.developerRepository.save(dto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.pagination.getPaginatedResponse(
      this.developerRepository,
      paginationQueryDto,
    );
  }

  async update(id: number, dto: UpdateDeveloperDto): Promise<void> {
    await this.developerRepository.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.developerRepository.delete(id);
  }
}
