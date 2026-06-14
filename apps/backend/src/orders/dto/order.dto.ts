import { ExactData, Order, OrderItem, OrderStatus } from '@unlockit/shared';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemDto } from './order-item.dto';

export class OrderDto implements Order {
  id: string;
  status: OrderStatus;
  amountPaidWallet: number;
  amountPaidStripe: number;
  reservedAt: Date;
  completedAt: Date | null;
  items: OrderItem[];

  static from(order: OrderEntity, orderItemDtos: OrderItemDto[]): OrderDto {
    const dto = new OrderDto();

    dto.id = order.id;
    dto.status = order.status;
    dto.amountPaidWallet = order.amountPaidWallet;
    dto.amountPaidStripe = order.amountPaidStripe;
    dto.reservedAt = order.reservedAt;
    dto.completedAt = order.completedAt;
    dto.items = orderItemDtos;

    return dto;
  }
}

const _assertExact: ExactData<Order, OrderDto> = true;
