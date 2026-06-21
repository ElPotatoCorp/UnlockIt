import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '@unlockit/shared';
import { OrderItemEntity } from 'src/orders/entities/order-item.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PurchaseSummaryDto } from './dto/purchase-summary.dto';
import { PurchaseDto } from './dto/purchase.dto';
import { PurchaseKeysDto } from './dto/purchase-keys.dto';
import { PurchaseMapper } from './purchase.mapper';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    private readonly reviewsService: ReviewsService,
    private readonly commonService: CommonService,
  ) { }

  findAll(userId: string, paginationQuery: PaginationQueryDto): Promise<PaginatedDto<PurchaseSummaryDto>> {
    return this.commonService.pagination.getPaginatedResponse(
      this.orderItemRepository,
      paginationQuery,
      {
        relations: { order: true, game: true },
        where: {
          order: { userId, status: OrderStatus.COMPLETED },
        },
        order: {
          order: { createdAt: 'DESC' },
          game: { name: 'ASC' },
        },
        transform: { fn: PurchaseMapper.toSummary },
      },
    );
  }

  async findOne(
    userId: string,
    orderId: string,
    gameId: number,
  ): Promise<PurchaseDto> {
    const item = await this.commonService.entities.fetchEntityOrFail(this.orderItemRepository, {
      where: {
        orderId,
        gameId,
        order: { userId, status: OrderStatus.COMPLETED },
      },
      relations: { order: true, game: true },
    });

    const review = await this.reviewsService.findOne(userId, gameId)
      .then(value => value)
      .catch(() => undefined);

    return PurchaseMapper.toPurchase(item, review);
  }

  async findKeys(
    userId: string,
    orderId: string,
    gameId: number,
  ): Promise<PurchaseKeysDto> {
    // Verify the caller owns this purchase before exposing keys.
    await this.commonService.entities.entityExists(this.orderItemRepository, {
      orderId,
      gameId,
      order: { userId, status: OrderStatus.COMPLETED },
    });

    const stocks = await this.stockRepository.find({
      select: { productKey: true },
      where: { orderId, gameId },
      withDeleted: true,
    });

    return PurchaseMapper.toKeys(stocks);
  }

  // --- Reviews ---
  async addReview(userId: string, orderId: string, gameId: number, createReviewDto: CreateReviewDto) {
    if (await this.commonService.entities.entityExists(this.orderItemRepository, { orderId, gameId }) !== true)
      throw new ConflictException('You already made a review of this game');

    this.reviewsService.create(userId, gameId, createReviewDto);
  }

  async updateReview(userId: string, orderId: string, gameId: number, updateReviewDto: UpdateReviewDto) {
    await this.commonService.entities.entityExists(this.orderItemRepository, { orderId, gameId }, true);

    this.reviewsService.update(userId, gameId, updateReviewDto);
  }

  async removeReview(userId: string, orderId: string, gameId: number) {
    await this.commonService.entities.entityExists(this.orderItemRepository, { orderId, gameId }, true);

    this.reviewsService.remove(userId, gameId);
  }
}
