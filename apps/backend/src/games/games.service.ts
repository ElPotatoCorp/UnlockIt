import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SummaryGameDto } from './dto/summary-game.dto';
import { CommonService } from 'src/common/common.service';
import { Tag } from 'src/tags/entities/tag.entity';
import { Developer } from 'src/developers/entities/developer.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { GamePlatform } from 'src/platforms/entities/game-platform.entity';
import { Media } from 'src/media/entities/media.entity';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';
import { GameDetailDto } from './dto/game-detail.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(GamePlatform) private readonly platformRepository: Repository<GamePlatform>,
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    private readonly commonService: CommonService,
  ) { }

  create(createGameDto: CreateGameDto) {
    return this.gameRepository.save(createGameDto);
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.gameRepository,
      paginationQueryDto,
      { transform: SummaryGameDto.fromEntity },
    );
  }

  async findOne(id: number): Promise<GameDetailDto | null> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) return null;
    return GameDetailDto.fromEntity(game);
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  remove(id: number) {
    return this.gameRepository.delete(id);
  }

  // --- Tags ---
  async addTag(game: Game, tag: Tag): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'tags')
      .of(game.id)
      .add(tag.id);
  }

  async removeTag(game: Game, tag: Tag): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'tags')
      .of(game.id)
      .remove(tag.id);
  }

  async setTags(game: Game, tags: Tag[]): Promise<void> {
    const current = await game.tags;
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'tags')
      .of(game.id)
      .addAndRemove(tags.map(t => t.id), current.map(t => t.id));
  }

  async setTagsById(game: Game, tagIds: number[]): Promise<void> {
    const current = await game.tags;
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'tags')
      .of(game.id)
      .addAndRemove(tagIds, current.map(t => t.id));
  }

  // --- Developers ---
  async addDeveloper(game: Game, developer: Developer): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'developers')
      .of(game.id)
      .add(developer.id);
  }

  async removeDeveloper(game: Game, developer: Developer): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'developers')
      .of(game.id)
      .remove(developer.id);
  }

  async setDevelopers(game: Game, developers: Developer[]): Promise<void> {
    const current = await game.developers;
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'developers')
      .of(game.id)
      .addAndRemove(developers.map(d => d.id), current.map(d => d.id));
  }

  async setDevelopersById(game: Game, developerIds: number[]): Promise<void> {
    const current = await game.developers;
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'developers')
      .of(game.id)
      .addAndRemove(developerIds, current.map(d => d.id));
  }

  // --- Publishers ---
  async addPublisher(game: Game, publisher: Publisher): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'publishers')
      .of(game.id)
      .add(publisher.id);
  }

  async removePublisher(game: Game, publisher: Publisher): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'publishers')
      .of(game.id)
      .remove(publisher.id);
  }

  async setPublishers(game: Game, publishers: Publisher[]): Promise<void> {
    const current = await game.publishers;
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'publishers')
      .of(game.id)
      .addAndRemove(publishers.map(p => p.id), current.map(p => p.id));
  }

  async setPublishersById(game: Game, publisherIds: number[]): Promise<void> {
    const current = await game.publishers;
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'publishers')
      .of(game.id)
      .addAndRemove(publisherIds, current.map(p => p.id));
  }

  // --- Platforms ---
  async upsertPlatforms(game: Game, dto: UpdatePlatformDto): Promise<void> {
    // game_platforms row is created here if it doesn't exist yet
    await this.platformRepository.upsert(
      { gameId: game.id, ...dto },
      { conflictPaths: ['gameId'], skipUpdateIfNoValuesChanged: true },
    );
  }

  // --- Media ---
  async addMedia(game: Game, dto: CreateMediaDto): Promise<Media> {
    return this.mediaRepository.save({ gameId: game.id, ...dto });
  }

  async removeMedia(game: Game, media: Media): Promise<void> {
    await this.mediaRepository.delete(media.id);
  }

}
