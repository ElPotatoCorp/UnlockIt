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
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GamesControllerDoc } from 'src/docs/games/games.controller.doc';
import { Game } from './entities/game.entity';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';
import { Tag } from 'src/tags/entities/tag.entity';
import { Developer } from 'src/developers/entities/developer.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Media } from 'src/media/entities/media.entity';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';
import { BulkIdsDto } from 'src/common/dto/bulk-ids.dto';
import { MinRole } from 'src/user/decorators/support-roles.decorator';
import { EmployeeRole } from '@unlockit/shared';

@GamesControllerDoc.Controller()
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @GamesControllerDoc.Create()
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @GamesControllerDoc.FindAll()
  @Public()
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.gamesService.findAll(paginationQueryDto);
  }

  @GamesControllerDoc.FindOne()
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @GamesControllerDoc.Update()
  @MinRole(EmployeeRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gamesService.update(game.id, updateGameDto);
  }

  @GamesControllerDoc.Remove()
  @Delete(':id')
  remove(@Param('id', EntityExistsPipe(Game)) game: Game) {
    return this.gamesService.remove(game.id);
  }

  // --- Tags ---
  @GamesControllerDoc.AddTag()
  @Post(':id/tags/:tagId')
  addTag(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Param('tagId', EntityExistsPipe(Tag)) tag: Tag,
  ) {
    return this.gamesService.addTag(game, tag);
  }

  @GamesControllerDoc.RemoveTag()
  @Delete(':id/tags/:tagId')
  removeTag(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Param('tagId', EntityExistsPipe(Tag)) tag: Tag,
  ) {
    return this.gamesService.removeTag(game, tag);
  }

  @GamesControllerDoc.SetTags()
  @Put(':id/tags')
  setTags(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Body() dto: BulkIdsDto,
  ) {
    // Resolve tag entities then bulk replace
    // BulkIdsDto: { ids: number[] }
    // Service resolves them and calls setTags
    return this.gamesService.setTagsById(game, dto.ids);
  }

  // --- Developers ---
  @GamesControllerDoc.AddDeveloper()
  @Post(':id/developers/:developerId')
  addDeveloper(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Param('developerId', EntityExistsPipe(Developer)) developer: Developer,
  ) {
    return this.gamesService.addDeveloper(game, developer);
  }

  @GamesControllerDoc.RemoveDeveloper()
  @Delete(':id/developers/:developerId')
  removeDeveloper(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Param('developerId', EntityExistsPipe(Developer)) developer: Developer,
  ) {
    return this.gamesService.removeDeveloper(game, developer);
  }

  @GamesControllerDoc.SetDevelopers()
  @Put(':id/developers')
  setDevelopers(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Body() dto: BulkIdsDto,
  ) {
    return this.gamesService.setDevelopersById(game, dto.ids);
  }

  // --- Publishers ---
  @GamesControllerDoc.AddPublisher()
  @Post(':id/publishers/:publisherId')
  addPublisher(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Param('publisherId', EntityExistsPipe(Publisher)) publisher: Publisher,
  ) {
    return this.gamesService.addPublisher(game, publisher);
  }

  @GamesControllerDoc.RemovePublisher()
  @Delete(':id/publishers/:publisherId')
  removePublisher(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Param('publisherId', EntityExistsPipe(Publisher)) publisher: Publisher,
  ) {
    return this.gamesService.removePublisher(game, publisher);
  }

  @GamesControllerDoc.SetPublishers()
  @Put(':id/publishers')
  setPublishers(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Body() dto: BulkIdsDto,
  ) {
    return this.gamesService.setPublishersById(game, dto.ids);
  }

  // --- Platforms ---
  @GamesControllerDoc.UpsertPlatforms()
  @Patch(':id/platforms')
  upsertPlatforms(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Body() dto: UpdatePlatformDto,
  ) {
    return this.gamesService.upsertPlatforms(game, dto);
  }

  // --- Media ---
  @GamesControllerDoc.AddMedia()
  @Post(':id/media')
  addMedia(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Body() dto: CreateMediaDto,
  ) {
    return this.gamesService.addMedia(game, dto);
  }

  @GamesControllerDoc.RemoveMedia()
  @Delete(':id/media/:mediaId')
  removeMedia(
    @Param('id', EntityExistsPipe(Game)) game: Game,
    @Param('mediaId', EntityExistsPipe(Media)) media: Media,
  ) {
    return this.gamesService.removeMedia(game, media);
  }
}
