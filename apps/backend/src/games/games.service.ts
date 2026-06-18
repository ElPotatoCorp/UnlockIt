import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './entities/game.entity';
import {
  And,
  Between,
  Equal,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThan,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Or,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
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
import { GameMapper } from './game.mapper';
import { ReviewMapper } from 'src/reviews/review.mapper';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ReviewVoteDto } from 'src/reviews/dto/review-vote.dto';

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
    private readonly reviewsService: ReviewsService,
    private readonly stocksService: StocksService,
    private readonly commonService: CommonService,
  ) {}

  create(createGameDto: CreateGameDto) {
    const game = this.gameRepository.create(createGameDto);
    game.platforms = {} as GamePlatformEntity;
    
    return this.gameRepository.save(game);
  }

  private getSearchQuery(options: SearchGameOptionsDto) {
    const orderDirection = options.order?.asc === false ? 'DESC' : 'ASC';

    const qb = this.gameRepository.createQueryBuilder('game');

    if (options.name) {
      qb.andWhere('game.slug LIKE :slug', {
        slug: `%${options.name}%`,
      });
    }

    if (options.type) {
      qb.andWhere('game.type = :type', { type: options.type });
    }

    if (options.price) {
      const { min, max } = options.price;
      if (max !== undefined) {
        qb.andWhere('game.price BETWEEN :min AND :max', {
          min,
          max: Math.max(min, max),
        });
      } else {
        qb.andWhere('game.price >= :min', { min });
      }
    }

    if (options.release) {
      const { when, date } = options.release;
      if (when === 'coming-soon') {
        qb.andWhere('game.coming_soon = true');
      } else if (date) {
        const ISOdate = date instanceof Date ? date.toISOString() : date;
        switch (when) {
          case 'exact':
            qb.andWhere('game.release_date = :date', { date: ISOdate });
            break;
          case 'before':
            qb.andWhere('game.release_date < :date', { date: ISOdate });
            break;
          case 'after':
            qb.andWhere('game.release_date > :date', { date: ISOdate });
            break;
        }
      }
    }

    if (options.tags?.length) {
      qb.innerJoin('game.tags', 'tag')
        .andWhere('tag.id IN (:...tagIds)', { tagIds: options.tags })
        .groupBy('game.id')
        .having('COUNT(DISTINCT tag.id) = :tagCount', {
          tagCount: options.tags.length,
        });
    }

    if (options.developers?.length) {
      qb.innerJoin('game.developers', 'developer').andWhere(
        'developer.id IN (:...developerIds)',
        { developerIds: options.developers },
      );
    }

    if (options.publishers?.length) {
      qb.innerJoin('game.publishers', 'publisher').andWhere(
        'publisher.id IN (:...publisherIds)',
        { publisherIds: options.publishers },
      );
    }

    if (options.platforms) {
      const activePlatforms = Object.keys(options.platforms);

      if (activePlatforms.length) {
        qb.innerJoin('game.platforms', 'platform');
        activePlatforms.forEach((col) => {
          qb.andWhere(`platform.${col} = :${col}`, {
            [col]: options.platforms![col],
          });
        });
      }
    }

    // Order
    switch (options.order?.by) {
      case 'price':
        qb.orderBy('game.price', orderDirection);
        break;
      default:
        qb.orderBy('game.name', orderDirection);
        break;
    }

    return qb;
  }

  async search(
    paginationQueryDto: PaginationQueryDto,
    options: SearchGameOptionsDto,
    userId?: string,
  ) {
    const res = await this.commonService.pagination.getPaginatedResponse(
      this.getSearchQuery(options),
      paginationQueryDto,
      { fn: GameMapper.toSummary },
    );

    if (userId) {
      const gameIds = res.data.map((game) => game.id);
      const wishlistedSet = new Set(
        await this.wishlistService.getWishlistedGameIds(userId, gameIds),
      );
      res.data = res.data.map((game) => ({
        ...game,
        wishlisted: wishlistedSet.has(game.id),
      }));
    }

    return res;
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return this.commonService.pagination.getPaginatedResponse(
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
    const current = game.tags;
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
    const current = game.tags;
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
    const current = game.developers;
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
    const current = game.developers;
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
    const current = game.publishers;
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
    const current = game.publishers;
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
  async updatePlatforms(gameId: number, dto: UpdatePlatformDto) {
    await this.platformRepository.update({ gameId }, dto);
  }

  // --- Media ---
  async addMedia(gameId: number, dto: CreateMediaDto) {
    const media = this.mediaRepository.create({ gameId, ...dto });
    return this.mediaRepository.save(media);
  }

  async removeMedia(mediaId: number) {
    await this.mediaRepository.delete(mediaId);
  }

  // --- Reviews ---
  getReviews(gameId: number, paginationQueryDto: PaginationQueryDto) {
    return this.reviewsService.findAll(gameId, paginationQueryDto);
  }

  reviewVote(userId: string, gameId: number, reviewVoteDto: ReviewVoteDto) {
    return this.reviewsService.vote(userId, gameId, reviewVoteDto);
  }

  // --- Stock ---
  addStocks(gameId: number, createStockDto: CreateStockDto) {
    return this.stocksService.create(gameId, createStockDto);
  }

  getStocks(gameId: number, paginationQueryDto: PaginationQueryDto) {
    return this.stocksService.findAll(gameId, paginationQueryDto);
  }
}
