import { ExactData, Order, OrderStatus } from '@unlockit/shared';
import { OrderItemDto } from './order-item.dto';
import { OrderEntityDoc } from 'src/docs/orders/entities/order.entity.doc';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto implements Order {
  @OrderEntityDoc.Id(false)
  id: string;

  @OrderEntityDoc.Status()
  status: OrderStatus;

  @OrderEntityDoc.AmountPaidWallet()
  amountPaidWallet: number;

  @OrderEntityDoc.AmountPaidStripe()
  amountPaidStripe: number;

  @OrderEntityDoc.CreatedAt()
  createdAt: Date;

  @OrderEntityDoc.CompletedAt()
  completedAt: Date | null;

  @ApiProperty({
    title: 'List of items',
    type: OrderItemDto,
    isArray: true,
  })
  items: OrderItemDto[];
}

const _assertExact: ExactData<Order, OrderDto> = true;
