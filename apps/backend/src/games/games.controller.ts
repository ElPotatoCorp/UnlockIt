import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GamesControllerDoc } from 'src/docs/games/games.controller.doc';
import { GameEntity } from './entities/game.entity';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { DeveloperEntity } from 'src/developers/entities/developer.entity';
import { PublisherEntity } from 'src/publishers/entities/publisher.entity';
import { MediaEntity } from 'src/media/entities/media.entity';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';
import { BulkIdsDto } from 'src/common/dto/bulk-ids.dto';
import { MinRole } from 'src/employees/decorators/support-roles.decorator';
import { EmployeeRole } from '@unlockit/shared';
import {
  SearchBodyDto,
  SearchGameOptionsDto,
} from './dto/search-game-options.dto';
import { CreateStockDto } from 'src/stocks/dto/create-stock.dto';
import { JwtAuthOptionalGuard } from 'src/auth/guards/jwt-auth-optional.guard';
import { User } from 'src/user/decorators/user.decorator';
import { BulkDuplicatedEntryPipe } from 'src/common/pipes/bulk-duplicated-entry.pipe';
import { StockEntity } from 'src/stocks/entities/stock.entity';

@GamesControllerDoc.Controller()
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @GamesControllerDoc.Create()
  @MinRole(EmployeeRole.ADMIN)
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @GamesControllerDoc.Search()
  @Public()
  @UseGuards(JwtAuthOptionalGuard)
  @Post('search/:slug')
  @HttpCode(HttpStatus.OK)
  search(
    @Param('slug') name: string,
    @Query() paginationQueryDto: PaginationQueryDto,
    @Body() searchGameOptionsDto: SearchBodyDto,
    @User('sub') userId?: string,
  ) {
    return this.gamesService.search(
      paginationQueryDto,
      {
        name,
        ...searchGameOptionsDto,
      } as SearchGameOptionsDto,
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
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @User('sub') userId?: string,
  ) {
    return this.gamesService.findOne(game, userId);
  }

  @GamesControllerDoc.Update()
  @MinRole(EmployeeRole.MODERATOR)
  @Patch(':id')
  update(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gamesService.update(game.id, updateGameDto);
  }

  @GamesControllerDoc.Remove()
  @MinRole(EmployeeRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', EntityExistsPipe(GameEntity)) game: GameEntity) {
    return this.gamesService.remove(game.id);
  }

  // --- Tags ---
  @GamesControllerDoc.AddTag()
  @MinRole(EmployeeRole.MODERATOR)
  @Post(':id/tags/:tagId')
  addTag(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Param('tagId', EntityExistsPipe(TagEntity)) tag: TagEntity,
  ) {
    return this.gamesService.addTag(game, tag);
  }

  @GamesControllerDoc.RemoveTag()
  @MinRole(EmployeeRole.MODERATOR)
  @Delete(':id/tags/:tagId')
  removeTag(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Param('tagId', EntityExistsPipe(TagEntity)) tag: TagEntity,
  ) {
    return this.gamesService.removeTag(game, tag);
  }

  @GamesControllerDoc.SetTags()
  @MinRole(EmployeeRole.MODERATOR)
  @Put(':id/tags')
  setTags(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Body() dto: BulkIdsDto,
  ) {
    return this.gamesService.setTagsById(game, dto.ids);
  }

  // --- Developers ---
  @GamesControllerDoc.AddDeveloper()
  @MinRole(EmployeeRole.MODERATOR)
  @Post(':id/developers/:developerId')
  addDeveloper(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Param('developerId', EntityExistsPipe(DeveloperEntity))
    developer: DeveloperEntity,
  ) {
    return this.gamesService.addDeveloper(game, developer);
  }

  @GamesControllerDoc.RemoveDeveloper()
  @MinRole(EmployeeRole.MODERATOR)
  @Delete(':id/developers/:developerId')
  removeDeveloper(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Param('developerId', EntityExistsPipe(DeveloperEntity))
    developer: DeveloperEntity,
  ) {
    return this.gamesService.removeDeveloper(game, developer);
  }

  @GamesControllerDoc.SetDevelopers()
  @MinRole(EmployeeRole.MODERATOR)
  @Put(':id/developers')
  setDevelopers(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Body() dto: BulkIdsDto,
  ) {
    return this.gamesService.setDevelopersById(game, dto.ids);
  }

  // --- Publishers ---
  @GamesControllerDoc.AddPublisher()
  @MinRole(EmployeeRole.MODERATOR)
  @Post(':id/publishers/:publisherId')
  addPublisher(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Param('publisherId', EntityExistsPipe(PublisherEntity))
    publisher: PublisherEntity,
  ) {
    return this.gamesService.addPublisher(game, publisher);
  }

  @GamesControllerDoc.RemovePublisher()
  @MinRole(EmployeeRole.MODERATOR)
  @Delete(':id/publishers/:publisherId')
  removePublisher(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Param('publisherId', EntityExistsPipe(PublisherEntity))
    publisher: PublisherEntity,
  ) {
    return this.gamesService.removePublisher(game, publisher);
  }

  @GamesControllerDoc.SetPublishers()
  @MinRole(EmployeeRole.MODERATOR)
  @Put(':id/publishers')
  setPublishers(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Body() dto: BulkIdsDto,
  ) {
    return this.gamesService.setPublishersById(game, dto.ids);
  }

  // --- Platforms ---
  @GamesControllerDoc.UpsertPlatforms()
  @MinRole(EmployeeRole.MODERATOR)
  @Patch(':id/platforms')
  upsertPlatforms(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Body() dto: UpdatePlatformDto,
  ) {
    return this.gamesService.upsertPlatforms(game, dto);
  }

  // --- Media ---
  @GamesControllerDoc.AddMedia()
  @MinRole(EmployeeRole.MODERATOR)
  @Post(':id/media')
  addMedia(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Body() dto: CreateMediaDto,
  ) {
    return this.gamesService.addMedia(game, dto);
  }

  @GamesControllerDoc.RemoveMedia()
  @MinRole(EmployeeRole.MODERATOR)
  @Delete(':id/media/:mediaId')
  removeMedia(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Param('mediaId', EntityExistsPipe(MediaEntity)) media: MediaEntity,
  ) {
    return this.gamesService.removeMedia(game, media);
  }

  // --- Stocks ---
  //@MinRole(EmployeeRole.SUPER_ADMIN)
  @Post(':id/stocks')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  addStocks(
    @Param('id', EntityExistsPipe(GameEntity)) game: GameEntity,
    @Body(BulkDuplicatedEntryPipe(StockEntity, 'productKey', 'productKeys'))
    createStockDto: CreateStockDto,
  ) {
    return this.gamesService.addStocks(game.id, createStockDto);
  }

  @MinRole(EmployeeRole.SUPER_ADMIN)
  @Get(':id/stocks')
  getStocks(
    @Param('id') id: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.gamesService.getStocks(+id, paginationQueryDto);
  }
}
