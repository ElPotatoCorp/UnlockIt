import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { OrderDto } from './dto/order.dto';
import { OrderListDto } from './dto/order-list.dto';
import { entityExists } from 'src/common/pipes/entity-exists.pipe';
import { OrderStatus } from '@unlockit/shared';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { OrderItemDto } from './dto/order-item.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    private readonly commonService: CommonService,
  ) {}

  findAll(userId: string, paginationQuery: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.orderRepository,
      paginationQuery,
      {
        where: { userId },
        order: { reservedAt: 'DESC' },
        transform: { fn: OrderListDto.fromEntity },
      },
    );
  }

  async findOne(orderId: string, userId: string): Promise<OrderDto> {
    const order = (await entityExists(
      this.orderRepository,
      ['id', 'userId'],
      [orderId, userId],
      true,
    )) as unknown as OrderEntity;

    const items = await order.items;

    const orderItemDtos = await Promise.all(
      items.map(async (item) => {
        const game = await item.game;
        let keys: string[] = [];

        if (order.status === OrderStatus.COMPLETED) {
          const stocks = await this.stockRepository.find({
            select: { productKey: true },
            where: { orderId, gameId: item.gameId },
            withDeleted: true,
          });

          keys = stocks.map((s) => s.productKey);
        }

        return OrderItemDto.from(item, game, keys);
      }),
    );

    return OrderDto.from(order, orderItemDtos);
  }
}
