import { ExactData, Order, OrderStatus } from '@unlockit/shared';
import { OrderItemDto } from './order-item.dto';

export class OrderDetailDto implements Order {
  id: string;
  status: OrderStatus;
  amountPaidWallet: number;
  amountPaidStripe: number;
  createdAt: Date;
  completedAt: Date | null;
  items: OrderItemDto[];
}

const _assertExact: ExactData<Order, OrderDetailDto> = true;
