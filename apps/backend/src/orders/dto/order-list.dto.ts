import { ExactData, OrderStatus, OrderSummary } from '@unlockit/shared';
import { OrderEntity } from '../entities/order.entity';

export class OrderListDto implements OrderSummary {
  id: string;
  status: OrderStatus;
  amountPaidWallet: number;
  amountPaidStripe: number;
  reservedAt: Date;
  completedAt: Date | null;

  static fromEntity(order: OrderEntity): OrderListDto {
    const dto = new OrderListDto();

    dto.id = order.id;
    dto.status = order.status;
    dto.amountPaidWallet = order.amountPaidWallet;
    dto.amountPaidStripe = order.amountPaidStripe;
    dto.reservedAt = order.reservedAt;
    dto.completedAt = order.completedAt;

    return dto;
  }

  static fromEntities(orders: OrderEntity[]): OrderListDto[] {
    return orders.map(OrderListDto.fromEntity);
  }
}

const _assertExact: ExactData<OrderSummary, OrderListDto> = true;
