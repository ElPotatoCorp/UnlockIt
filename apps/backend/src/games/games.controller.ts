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
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GamesControllerDoc } from 'src/docs/games/games.controller.doc';
import { GameEntity } from './entities/game.entity';
import { EntityFetchPipe } from 'src/common/entities/pipes/fetch-entity.pipe';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { DeveloperEntity } from 'src/developers/entities/developer.entity';
import { PublisherEntity } from 'src/publishers/entities/publisher.entity';
import { MediaEntity } from 'src/media/entities/media.entity';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';
import { BulkIdsDto } from 'src/common/dto/bulk-ids.dto';
import { MinRole } from 'src/employees/decorators/support-roles.decorator';
import { EmployeeRole } from '@unlockit/shared';
import { SearchBodyDto } from './dto/search-game-options.dto';
import { CreateStockDto } from 'src/stocks/dto/create-stock.dto';
import { JwtAuthOptionalGuard } from 'src/auth/guards/jwt-auth-optional.guard';
import { User } from 'src/user/decorators/user.decorator';
import { BulkDuplicatedEntryPipe } from 'src/common/entities/pipes/bulk-duplicated-entry.pipe';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { EntityExistsPipe } from 'src/common/entities/pipes/entity-exists.pipe';
import { ReviewVoteDto } from 'src/reviews/dto/review-vote.dto';
import { GameMapper } from './game.mapper';

@GamesControllerDoc.Controller()
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @GamesControllerDoc.Create()
  @MinRole(EmployeeRole.ADMIN)
  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return GameMapper.toSummary(await this.gamesService.create(createGameDto));
  }

  @GamesControllerDoc.Search()
  @Public()
  @UseGuards(JwtAuthOptionalGuard)
  @Post(['search', 'search/:slug'])
  @HttpCode(HttpStatus.OK)
  search(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Body() searchGameOptionsDto: SearchBodyDto,
    @Param('slug') name?: string,
    @User('sub') userId?: string,
  ) {
    return this.gamesService.search(
      paginationQueryDto,
      {
        name,
        ...searchGameOptionsDto,
      },
      userId,
    );
  }

  @GamesControllerDoc.FindAll()
  @Public()
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.gamesService.findAll(paginationQueryDto);
  }

  @GamesControllerDoc.FindOne()
  @Public()
  @UseGuards(JwtAuthOptionalGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe, EntityFetchPipe(GameEntity, 'id', { relations: {
      tags: true,
      publishers: true,
      developers: true,
      platforms: true,
      media: true,
      series: true,
    }})) game: GameEntity,
    @User('sub') userId?: string,
  ) {
    return this.gamesService.findOne(game, userId);
  }

  @GamesControllerDoc.Update()
  @MinRole(EmployeeRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) id: number,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gamesService.update(id, updateGameDto);
  }

  @GamesControllerDoc.Remove()
  @MinRole(EmployeeRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) id: number) {
    return this.gamesService.remove(id);
  }

  // --- Tags ---
  @GamesControllerDoc.AddTag()
  @MinRole(EmployeeRole.MODERATOR)
  @Post(':id/tags/:tagId')
  @HttpCode(HttpStatus.OK)
  addTag(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Param('tagId', ParseIntPipe, EntityExistsPipe(TagEntity)) tagId: number,
  ) {
    return this.gamesService.addTag(gameId, tagId);
  }

  @GamesControllerDoc.RemoveTag()
  @MinRole(EmployeeRole.MODERATOR)
  @Delete(':id/tags/:tagId')
  removeTag(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Param('tagId', ParseIntPipe, EntityExistsPipe(TagEntity)) tagId: number,
  ) {
    return this.gamesService.removeTag(gameId, tagId);
  }

  @GamesControllerDoc.SetTags()
  @MinRole(EmployeeRole.MODERATOR)
  @Patch(':id/tags')
  setTags(
    @Param('id', ParseIntPipe, EntityFetchPipe(GameEntity, 'id', { relations: { tags: true } })) game: GameEntity,
    @Body() dto: BulkIdsDto,
  ) {
    return this.gamesService.setTagsById(game, dto.ids);
  }

  // --- Developers ---
  @GamesControllerDoc.AddDeveloper()
  @MinRole(EmployeeRole.MODERATOR)
  @Post(':id/developers/:developerId')
  @HttpCode(HttpStatus.OK)
  addDeveloper(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Param('developerId', ParseIntPipe, EntityExistsPipe(DeveloperEntity))
    developerId: number,
  ) {
    return this.gamesService.addDeveloper(gameId, developerId);
  }

  @GamesControllerDoc.RemoveDeveloper()
  @MinRole(EmployeeRole.MODERATOR)
  @Delete(':id/developers/:developerId')
  removeDeveloper(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Param('developerId', ParseIntPipe, EntityExistsPipe(DeveloperEntity))
    developerId: number,
  ) {
    return this.gamesService.removeDeveloper(gameId, developerId);
  }

  @GamesControllerDoc.SetDevelopers()
  @MinRole(EmployeeRole.MODERATOR)
  @Patch(':id/developers')
  setDevelopers(
    @Param('id', ParseIntPipe, EntityFetchPipe(GameEntity, 'id', { relations: { developers: true } })) game: GameEntity,
    @Body() dto: BulkIdsDto,
  ) {
    return this.gamesService.setDevelopersById(game, dto.ids);
  }

  // --- Publishers ---
  @GamesControllerDoc.AddPublisher()
  @MinRole(EmployeeRole.MODERATOR)
  @Post(':id/publishers/:publisherId')
  @HttpCode(HttpStatus.OK)
  addPublisher(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Param('publisherId', ParseIntPipe, EntityExistsPipe(PublisherEntity))
    publisherId: number,
  ) {
    return this.gamesService.addPublisher(gameId, publisherId);
  }

  @GamesControllerDoc.RemovePublisher()
  @MinRole(EmployeeRole.MODERATOR)
  @Delete(':id/publishers/:publisherId')
  removePublisher(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Param('publisherId', ParseIntPipe, EntityExistsPipe(PublisherEntity))
    publisherId: number,
  ) {
    return this.gamesService.removePublisher(gameId, publisherId);
  }

  @GamesControllerDoc.SetPublishers()
  @MinRole(EmployeeRole.MODERATOR)
  @Patch(':id/publishers')
  setPublishers(
    @Param('id', ParseIntPipe, EntityFetchPipe(GameEntity, 'id', { relations: { publishers: true } })) game: GameEntity,
    @Body() dto: BulkIdsDto,
  ) {
    return this.gamesService.setPublishersById(game, dto.ids);
  }

  // --- Platforms ---
  @GamesControllerDoc.UpdatePlatforms()
  @MinRole(EmployeeRole.MODERATOR)
  @Patch(':id/platforms')
  updatePlatforms(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Body() dto: UpdatePlatformDto,
  ) {
    return this.gamesService.updatePlatforms(gameId, dto);
  }

  // --- Media ---
  @GamesControllerDoc.AddMedia()
  @MinRole(EmployeeRole.MODERATOR)
  @Post(':id/media')
  addMedia(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Body() dto: CreateMediaDto,
  ) {
    return this.gamesService.addMedia(gameId, dto);
  }

  @GamesControllerDoc.RemoveMedia()
  @MinRole(EmployeeRole.MODERATOR)
  @Delete(':id/media/:mediaId')
  removeMedia(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) _: number,
    @Param('mediaId', ParseIntPipe, EntityExistsPipe(MediaEntity)) mediaId: number,
  ) {
    return this.gamesService.removeMedia(mediaId);
  }

  // --- Reviews ---
  @Public()
  @Get(':id/reviews')
  getReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.gamesService.getReviews(id, paginationQueryDto);
  }

  // --- Stocks ---
  @MinRole(EmployeeRole.SUPER_ADMIN)
  @Post(':id/stocks')
  @HttpCode(HttpStatus.NO_CONTENT)
  addStocks(
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Body(BulkDuplicatedEntryPipe(StockEntity, 'productKey', 'productKeys'))
    createStockDto: CreateStockDto,
  ) {
    return this.gamesService.addStocks(gameId, createStockDto);
  }

  @MinRole(EmployeeRole.SUPER_ADMIN)
  @Get(':id/stocks')
  getStocks(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.gamesService.getStocks(id, paginationQueryDto);
  }
}
