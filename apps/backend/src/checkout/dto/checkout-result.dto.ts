import { CheckoutResult, ExactData, Order } from '@unlockit/shared';

export class CheckoutResultDto implements CheckoutResult {
  order: Order;
  clientSecret: string | null;
}

const _assertExact: ExactData<CheckoutResult, CheckoutResultDto> = true;
