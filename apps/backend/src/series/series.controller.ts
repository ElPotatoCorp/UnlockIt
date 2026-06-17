import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { EntityExistsPipe, EntityFetchPipe } from 'src/common/pipes/entity.pipe';
import { SeriesEntity } from './entities/series.entity';
import { ModifyGamesInSerieDto } from './dto/modify-games-in-serie.dto';
import { SeriesControllerDoc } from 'src/docs/series/series.controller.doc';
import { DuplicatedEntryPipe } from 'src/common/pipes/duplicated-entry.pipe';
import { SeriesMapper } from './series.mapper';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @SeriesControllerDoc.Create()
  @Post()
  create(
    @Body(DuplicatedEntryPipe(SeriesEntity, 'slug'))
    createSeriesDto: CreateSeriesDto,
  ) {
    return this.seriesService.create(createSeriesDto);
  }

  @SeriesControllerDoc.FindAll()
  @Public()
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.seriesService.findAll(paginationQueryDto);
  }

  @SeriesControllerDoc.FindOne()
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe, EntityFetchPipe(SeriesEntity, 'id', { relations: { games: true } })) series: SeriesEntity) {
    return SeriesMapper.toSeries(series);
  }

  @SeriesControllerDoc.FindOneBySlug()
  @Public()
  @Get('/by-slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.seriesService.findBySlug(slug);
  }

  @SeriesControllerDoc.Update()
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id', ParseIntPipe, EntityExistsPipe(SeriesEntity)) id: number,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    return this.seriesService.update(id, updateSeriesDto);
  }

  @SeriesControllerDoc.AddGames()
  @Patch(':id/games')
  @HttpCode(HttpStatus.NO_CONTENT)
  modifyGames(
    @Param('id', ParseIntPipe, EntityExistsPipe(SeriesEntity)) id: number,
    @Body() modifyGamesInSerieDto: ModifyGamesInSerieDto,
  ) {
    return this.seriesService.modifyGames(
      id,
      modifyGamesInSerieDto,
      'add',
    );
  }

  @SeriesControllerDoc.Remove()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe, EntityExistsPipe(SeriesEntity)) id: number) {
    return this.seriesService.remove(id);
  }

  @SeriesControllerDoc.RemoveGames()
  @Delete(':id/games')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeGames(
    @Param('id', ParseIntPipe, EntityExistsPipe(SeriesEntity)) id: number,
    @Body() modifyGamesInSerieDto: ModifyGamesInSerieDto,
  ) {
    return this.seriesService.modifyGames(
      id,
      modifyGamesInSerieDto,
      'remove',
    );
  }
}
