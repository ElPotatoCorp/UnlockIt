import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { OrderDetailDto } from './dto/order-detail.dto';
import { OrderMapper } from './order.mapper';

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
        order: { reservedAt: 'DESC' },
        transform: { fn: OrderMapper.toSummary },
      },
    );
  }

  async findOne(orderId: string, userId: string): Promise<OrderDetailDto> {
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
      }
    );

    return OrderMapper.toDetail(order);
  }
}
