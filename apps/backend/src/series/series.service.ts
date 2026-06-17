import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { CommonService } from 'src/common/common.service';
import { ModifyGamesInSerieDto } from './dto/modify-games-in-serie.dto';
import { SeriesMapper } from './series.mapper';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(SeriesEntity)
    private readonly seriesRepository: Repository<SeriesEntity>,
    private readonly commonService: CommonService,
  ) {}

  async create(createSeriesDto: CreateSeriesDto) {
    const { gameIds, ...seriesData } = createSeriesDto;

    const _series = this.seriesRepository.create(seriesData);
    const series = await this.seriesRepository.save(_series);

    if (gameIds?.length) {
      await this.seriesRepository
        .createQueryBuilder()
        .relation(SeriesEntity, 'games')
        .of(series.id)
        .add(gameIds);
    }

    return series;
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.pagination.getPaginatedResponse(
      this.seriesRepository,
      paginationQueryDto,
    );
  }

  async findBySlug(slug: string) {
    const series = await this.commonService.entities.fetchEntityOrFail(this.seriesRepository, { where: { slug }, relations: { games: true } })
    return SeriesMapper.toSeries(series);
  }

  update(id: number, updateSeriesDto: UpdateSeriesDto) {
    this.seriesRepository.update(id, updateSeriesDto);
  }

  async modifyGames(
    id: number,
    modifyGamesInSerieDto: ModifyGamesInSerieDto,
    action: 'add' | 'remove',
  ) {
    const relation = this.seriesRepository
      .createQueryBuilder()
      .relation(SeriesEntity, 'games')
      .of(id);

    if (action === 'add') {
      await relation.add(modifyGamesInSerieDto.gameIds);
    } else {
      await relation.remove(modifyGamesInSerieDto.gameIds);
    }
  }

  remove(id: number) {
    this.seriesRepository.delete(id);
  }
}
