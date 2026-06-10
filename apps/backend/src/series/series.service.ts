import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CommonService } from 'src/common/common.service';
import { SummarySeriesDto } from './dto/summary-series.dto';
import { ModifyGamesInSerieDto } from './dto/modify-games-in-serie.dto';

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
    return this.commonService.getPaginatedResponse(
      this.seriesRepository,
      paginationQueryDto,
    );
  }

  async findOne(
    where: FindOptionsWhere<SeriesEntity>,
    msg: string,
  ): Promise<SummarySeriesDto> {
    const series = await this.seriesRepository.findOne({
      where,
      relations: { games: true },
    });

    if (!series) throw new NotFoundException(msg);

    return SummarySeriesDto.fromEntity(series);
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
