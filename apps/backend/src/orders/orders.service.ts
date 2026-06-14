import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '@unlockit/shared';
import { OrderEntity } from './entities/order.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { OrderDto } from './dto/order.dto';
import { OrderItemDto } from './dto/order-item.dto';
import { OrderListDto } from './dto/order-list.dto';

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
        order: { reservedAt: 'DESC' as const },
        transform: { fn: OrderListDto.fromEntities, each: false },
      },
    );
  }

  async findOne(orderId: string, userId: string): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

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

        return OrderItemDto.fromEntity(item, game, keys);
      }),
    );

    return OrderDto.fromEntity(order, orderItemDtos);
  }
}
