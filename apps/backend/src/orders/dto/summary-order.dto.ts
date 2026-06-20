import { ExactData, OrderStatus, OrderSummary } from '@unlockit/shared';
import { OrderEntityDoc } from 'src/docs/orders/entities/order.entity.doc';

export class OrderSummaryDto implements OrderSummary {
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
}

const _assertExact: ExactData<OrderSummary, OrderSummaryDto> = true;
