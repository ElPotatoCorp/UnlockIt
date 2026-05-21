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
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Like } from 'typeorm';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';
import { Series } from './entities/series.entity';
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
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne({ id: +id }, `Series #${id} not found`);
  }

  @SeriesControllerDoc.FindOneBySlug()
  @Public()
  @Get('/by-slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.seriesService.findOne({ slug }, `Series '${slug}' not found`);
  }

  @SeriesControllerDoc.Update()
  @Patch(':id')
  @HttpCode(204)
  update(
    @Param('id', EntityExistsPipe(Series)) series: Series,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    return this.seriesService.update(series.id, updateSeriesDto);
  }

  @SeriesControllerDoc.AddGames()
  @Patch(':id/games')
  @HttpCode(204)
  modifyGames(
    @Param('id', EntityExistsPipe(Series)) series: Series,
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
  @HttpCode(204)
  remove(@Param('id', EntityExistsPipe(Series)) series: Series) {
    return this.seriesService.remove(series.id);
  }

  @SeriesControllerDoc.RemoveGames()
  @Delete(':id/games')
  @HttpCode(204)
  removeGames(
    @Param('id', EntityExistsPipe(Series)) series: Series,
    @Body() modifyGamesInSerieDto: ModifyGamesInSerieDto,
  ) {
    return this.seriesService.modifyGames(
      series.id,
      modifyGamesInSerieDto,
      'remove',
    );
  }
}
