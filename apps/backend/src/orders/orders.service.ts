import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { OrderDto } from './dto/order.dto';
import { OrderMapper } from './order.mapper';
import { OrderStatus } from '@unlockit/shared';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly commonService: CommonService,
  ) {}

  findAll(userId: string, paginationQuery: PaginationQueryDto) {
    return this.commonService.pagination.getPaginatedResponse(
      this.orderRepository,
      paginationQuery,
      {
        where: { userId },
        order: { createdAt: 'DESC' },
        transform: { fn: OrderMapper.toSummary },
      },
    );
  }

  async findOne(orderId: string, userId: string): Promise<OrderDto> {
    const order = await this.commonService.entities.fetchEntityOrFail(
      this.orderRepository,
      {
        where: {
          id: orderId,
          userId,
        },
        relations: {
          items: {
            game: true,
          },
        },
      },
    );

    return OrderMapper.toOrder(order);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  deleteStaleOrders() {
    const quarterOfHourLater = new Date();
    quarterOfHourLater.setMinutes(quarterOfHourLater.getMinutes() - 15);

    this.orderRepository.delete({
      status: OrderStatus.PENDING_PAYMENT,
      createdAt: quarterOfHourLater,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  deleteCancelledOrders() {
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() - 30);

    this.orderRepository.delete({
      status: OrderStatus.CANCELLED,
      createdAt: LessThan(thirtyDaysLater),
    });
  }
}
