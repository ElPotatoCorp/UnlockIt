import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
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

    return PurchaseMapper.toPurchase(item);
  }

  async findKeys(
    userId: string,
    orderId: string,
    gameId: number,
  ): Promise<PurchaseKeysDto> {
    // Verify the caller owns this purchase before exposing keys.
    await this.commonService.entities.entityExists(this.orderItemRepository, {
      where: {
        orderId,
        gameId,
        order: { userId, status: OrderStatus.COMPLETED },
      },
      relations: { order: true },
    });

    const stocks = await this.stockRepository.find({
      select: { productKey: true },
      where: { orderId, gameId },
      withDeleted: true,
    });

    return PurchaseMapper.toKeys(stocks);
  }
}
