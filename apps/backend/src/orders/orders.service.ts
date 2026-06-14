import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { OrderDto } from './dto/order.dto';
import { OrderListDto } from './dto/order-list.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
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
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    return OrderDto.fromEntity(order);
  }
}
