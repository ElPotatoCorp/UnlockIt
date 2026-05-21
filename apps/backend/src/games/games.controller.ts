import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GamesControllerDoc } from 'src/docs/games/games.controller.doc';
import { Game } from './entities/game.entity';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';

@GamesControllerDoc.Controller()
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

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
}
