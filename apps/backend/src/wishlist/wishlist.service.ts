import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
    private readonly commonService: CommonService,
  ) {}

  findAll(userId: string, pagination: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.wishlistRepository,
      pagination,
      {
        where: { userId },
        order: { addedAt: 'DESC' },
        transform: {
          fn: (entry: WishlistEntity) => SummaryGameDto.fromEntity(entry.game)
        },
      },
    );
  }

  async isInWishlist(
    userId: string,
    gameId: number,
  ): Promise<{ wishlisted: boolean }> {
    const exists = await this.wishlistRepository.existsBy({ userId, gameId });
    return { wishlisted: exists };
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
