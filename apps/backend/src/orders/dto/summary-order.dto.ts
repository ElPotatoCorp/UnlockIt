import { ExactData, OrderStatus, OrderSummary } from '@unlockit/shared';

export class SummaryOrderDto implements OrderSummary {
  id: string;
  status: OrderStatus;
  amountPaidWallet: number;
  amountPaidStripe: number;
  createdAt: Date;
  completedAt: Date | null;
}

const _assertExact: ExactData<OrderSummary, SummaryOrderDto> = true;
