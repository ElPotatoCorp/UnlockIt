import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { GameMapper } from 'src/games/game.mapper';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
    private readonly commonService: CommonService,
  ) {}

  findAll(userId: string, pagination: PaginationQueryDto) {
    return this.commonService.pagination.getPaginatedResponse(
      this.wishlistRepository,
      pagination,
      {
        where: { userId },
        relations: { game: true },
        order: { addedAt: 'DESC' },
        transform: { fn: (wishlist: WishlistEntity) => GameMapper.toSummary(wishlist.game) },
      },
    );
  }

  async isInWishlist(userId: string, gameId: number): Promise<boolean> {
    const exists = await this.wishlistRepository.existsBy({ userId, gameId });
    return exists;
  }

  async getWishlistedGameIds(
    userId: string,
    gameIds: number[],
  ): Promise<number[]> {
    if (!gameIds.length) return [];

    const wishlist = await this.wishlistRepository.find({
      where: {
        userId,
        gameId: In(gameIds),
      },
      select: { gameId: true },
    });

    return wishlist.map((w) => w.gameId);
  }

  async add(userId: string, gameId: number): Promise<void> {
    await this.wishlistRepository
      .createQueryBuilder()
      .insert()
      .into(WishlistEntity)
      .values({ userId, gameId })
      .orIgnore() // idempotent, silently does nothing if row already exists
      .execute();
  }

  async remove(userId: string, gameId: number): Promise<void> {
    await this.wishlistRepository.delete({ userId, gameId });
  }
}
