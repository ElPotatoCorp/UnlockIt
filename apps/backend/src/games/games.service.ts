import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './entities/game.entity';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  LessThan,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
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
import { SearchGameOptionsDto } from './dto/search-game-options.dto';
import { StocksService } from 'src/stocks/stocks.service';
import { CreateStockDto } from 'src/stocks/dto/create-stock.dto';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { GameDetailDto } from './dto/game-detail.dto';
import { GameMapper } from './game.mapper';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(GamePlatformEntity)
    private readonly platformRepository: Repository<GamePlatformEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly wishlistService: WishlistService,
    private readonly stocksService: StocksService,
    private readonly commonService: CommonService,
  ) {}

  create(createGameDto: CreateGameDto) {
    const game = this.gameRepository.create(createGameDto);
    return this.gameRepository.save(game);
  }

  private getBasicSearch(options: SearchGameOptionsDto) {
    const where: FindOptionsWhere<GameEntity> = {};

    where.slug = Like(`%${options.name}%`);
    where.type = options.type;

    if (options.price) {
      const { min, max } = options.price;
      if (max !== undefined) {
        where.price = Between(min, Math.max(min, max));
      } else {
        where.price = MoreThanOrEqual(min);
      }
    }

    if (options.release) {
      const { when, date } = options.release;

      if (when === 'coming-soon') {
        where.comingSoon = true;
      } else if (date) {
        const ISOdate = date instanceof Date ? date.toISOString() : date;

        switch (when) {
          case 'exact':
            where.releaseDate = ISOdate;
            break;
          case 'before':
            where.releaseDate = LessThan(ISOdate);
            break;
          case 'after':
            where.releaseDate = MoreThan(ISOdate);
            break;
        }
      }
    }

    const order: FindOptionsOrder<GameEntity> = {};
    const orderDirection = options.order?.asc === false ? 'DESC' : 'ASC';
    switch (options.order.by) {
      case 'price':
        order.price = orderDirection;
        break;
      default:
        order.name = orderDirection;
        break;
    }

    return { where, order };
  }

  async search(
    paginationQueryDto: PaginationQueryDto,
    options: SearchGameOptionsDto,
    userId?: string,
  ) {
    const { where, order } = this.getBasicSearch(options);

    const res = await this.commonService.getPaginatedResponse(
      this.gameRepository,
      paginationQueryDto,
      { where, order, transform: { fn: GameMapper.toSummary } },
    );

    if (userId) {
      const gameIds = res.data.map((game) => game.id);
      const wishlistedSet = new Set(
        await this.wishlistService.getWishlistedGameIds(userId, gameIds),
      );

      res.data = res.data.map((game) => {
        game.wishlisted = wishlistedSet.has(game.id);
        return game;
      });
    }

    return res;
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.gameRepository,
      paginationQueryDto,
      { transform: { fn: GameMapper.toSummary } },
    );
  }

  async findOne(game: GameEntity, userId?: string) {
    return GameMapper.toDetail(
      game,
      userId
        ? await this.wishlistService.isInWishlist(userId, game.id)
        : false,
    );
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  remove(id: number) {
    return this.gameRepository.delete(id);
  }

  // --- Tags ---
  async addTag(gameId: number, tagId: number) {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'tags')
      .of(gameId)
      .add(tagId);
  }

  async removeTag(gameId: number, tagId: number) {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'tags')
      .of(gameId)
      .remove(tagId);
  }

  async setTags(game: GameEntity, tags: TagEntity[]) {
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

  async setTagsById(game: GameEntity, tagIds: number[]) {
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
  async addDeveloper(gameId: number, developerId: number) {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'developers')
      .of(gameId)
      .add(developerId);
  }

  async removeDeveloper(gameId: number, developerId: number) {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'developers')
      .of(gameId)
      .remove(developerId);
  }

  async setDevelopers(game: GameEntity, developers: DeveloperEntity[]) {
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

  async setDevelopersById(game: GameEntity, developerIds: number[]) {
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
  async addPublisher(gameId: number, publisherId: number) {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'publishers')
      .of(gameId)
      .add(publisherId);
  }

  async removePublisher(gameId: number, publisherId: number) {
    await this.gameRepository
      .createQueryBuilder()
      .relation(GameEntity, 'publishers')
      .of(gameId)
      .remove(publisherId);
  }

  async setPublishers(game: GameEntity, publishers: PublisherEntity[]) {
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

  async setPublishersById(game: GameEntity, publisherIds: number[]) {
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
  async upsertPlatforms(gameId: number, dto: UpdatePlatformDto) {
    // game_platforms row is created here if it doesn't exist yet
    await this.platformRepository.upsert(
      { gameId, ...dto },
      { conflictPaths: ['gameId'], skipUpdateIfNoValuesChanged: true },
    );
  }

  // --- Media ---
  async addMedia(gameId: number, dto: CreateMediaDto) {
    const media = this.mediaRepository.create({ gameId, ...dto });
    return this.mediaRepository.save(media);
  }

  async removeMedia(mediaId: number) {
    await this.mediaRepository.delete(mediaId);
  }

  // --- Stock ---
  addStocks(gameId: number, createStockDto: CreateStockDto) {
    return this.stocksService.create(gameId, createStockDto);
  }

  getStocks(gameId: number, paginationQueryDto: PaginationQueryDto) {
    return this.stocksService.findAll(gameId, paginationQueryDto);
  }
}
