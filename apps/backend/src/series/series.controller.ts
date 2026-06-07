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
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Like } from 'typeorm';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';
import { SeriesEntity } from './entities/series.entity';
import { ModifyGamesInSerieDto } from './dto/modify-games-in-serie.dto';
import { SeriesControllerDoc } from 'src/docs/series/series.controller.doc';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @SeriesControllerDoc.Create()
  @Post()
  create(@Body() createSeriesDto: CreateSeriesDto) {
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
  findOne(@Param('id', EntityExistsPipe(SeriesEntity)) series: SeriesEntity) {
    return series;
  }

  @SeriesControllerDoc.FindOneBySlug()
  @Public()
  @Get('/by-slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.seriesService.findOne({ slug }, `Series '${slug}' not found`);
  }

  @SeriesControllerDoc.Update()
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id', EntityExistsPipe(SeriesEntity)) series: SeriesEntity,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    return this.seriesService.update(series.id, updateSeriesDto);
  }

  @SeriesControllerDoc.AddGames()
  @Patch(':id/games')
  @HttpCode(HttpStatus.NO_CONTENT)
  modifyGames(
    @Param('id', EntityExistsPipe(SeriesEntity)) series: SeriesEntity,
    @Body() modifyGamesInSerieDto: ModifyGamesInSerieDto,
  ) {
    return this.seriesService.modifyGames(
      series.id,
      modifyGamesInSerieDto,
      'add',
    );
  }

  @SeriesControllerDoc.Remove()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', EntityExistsPipe(SeriesEntity)) series: SeriesEntity) {
    return this.seriesService.remove(series.id);
  }

  @SeriesControllerDoc.RemoveGames()
  @Delete(':id/games')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeGames(
    @Param('id', EntityExistsPipe(SeriesEntity)) series: SeriesEntity,
    @Body() modifyGamesInSerieDto: ModifyGamesInSerieDto,
  ) {
    return this.seriesService.modifyGames(
      series.id,
      modifyGamesInSerieDto,
      'remove',
    );
  }
}
