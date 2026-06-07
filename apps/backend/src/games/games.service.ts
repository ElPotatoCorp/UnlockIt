import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './entities/game.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SummaryGameDto } from './dto/summary-game.dto';
import { CommonService } from 'src/common/common.service';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { DeveloperEntity } from 'src/developers/entities/developer.entity';
import { PublisherEntity } from 'src/publishers/entities/publisher.entity';
import { GamePlatformEntity } from 'src/platforms/entities/game-platform.entity';
import { MediaEntity } from 'src/media/entities/media.entity';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';
import { GameDetailDto } from './dto/game-detail.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(GamePlatformEntity)
    private readonly platformRepository: Repository<GamePlatformEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly commonService: CommonService,
  ) {}

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
  async addTag(game: GameEntity, tag: TagEntity): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'tags')
      .of(game.id)
      .add(tag.id);
  }

  async removeTag(game: GameEntity, tag: TagEntity): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'tags')
      .of(game.id)
      .remove(tag.id);
  }

  async setTags(game: GameEntity, tags: TagEntity[]): Promise<void> {
    const current = await game.tags;
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'tags')
      .of(game.id)
      .addAndRemove(
        tags.map((t) => t.id),
        current.map((t) => t.id),
      );
  }

  async setTagsById(game: GameEntity, tagIds: number[]): Promise<void> {
    const current = await game.tags;
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'tags')
      .of(game.id)
      .addAndRemove(
        tagIds,
        current.map((t) => t.id),
      );
  }

  // --- Developers ---
  async addDeveloper(
    game: GameEntity,
    developer: DeveloperEntity,
  ): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'developers')
      .of(game.id)
      .add(developer.id);
  }

  async removeDeveloper(
    game: GameEntity,
    developer: DeveloperEntity,
  ): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'developers')
      .of(game.id)
      .remove(developer.id);
  }

  async setDevelopers(
    game: GameEntity,
    developers: DeveloperEntity[],
  ): Promise<void> {
    const current = await game.developers;
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'developers')
      .of(game.id)
      .addAndRemove(
        developers.map((d) => d.id),
        current.map((d) => d.id),
      );
  }

  async setDevelopersById(
    game: GameEntity,
    developerIds: number[],
  ): Promise<void> {
    const current = await game.developers;
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'developers')
      .of(game.id)
      .addAndRemove(
        developerIds,
        current.map((d) => d.id),
      );
  }

  // --- Publishers ---
  async addPublisher(
    game: GameEntity,
    publisher: PublisherEntity,
  ): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'publishers')
      .of(game.id)
      .add(publisher.id);
  }

  async removePublisher(
    game: GameEntity,
    publisher: PublisherEntity,
  ): Promise<void> {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'publishers')
      .of(game.id)
      .remove(publisher.id);
  }

  async setPublishers(
    game: GameEntity,
    publishers: PublisherEntity[],
  ): Promise<void> {
    const current = await game.publishers;
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'publishers')
      .of(game.id)
      .addAndRemove(
        publishers.map((p) => p.id),
        current.map((p) => p.id),
      );
  }

  async setPublishersById(
    game: GameEntity,
    publisherIds: number[],
  ): Promise<void> {
    const current = await game.publishers;
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'publishers')
      .of(game.id)
      .addAndRemove(
        publisherIds,
        current.map((p) => p.id),
      );
  }

  // --- Platforms ---
  async upsertPlatforms(
    game: GameEntity,
    dto: UpdatePlatformDto,
  ): Promise<void> {
    // game_platforms row is created here if it doesn't exist yet
    await this.platformRepository.upsert(
      { gameId: game.id, ...dto },
      { conflictPaths: ['gameId'], skipUpdateIfNoValuesChanged: true },
    );
  }

  // --- Media ---
  async addMedia(game: GameEntity, dto: CreateMediaDto): Promise<MediaEntity> {
    return this.mediaRepository.save({ gameId: game.id, ...dto });
  }

  async removeMedia(game: GameEntity, media: MediaEntity): Promise<void> {
    await this.mediaRepository.delete(media.id);
  }
}
