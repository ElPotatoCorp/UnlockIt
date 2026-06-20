import { CheckoutResult, ExactData } from '@unlockit/shared';
import { OrderDto } from 'src/orders/dto/order.dto';

export class CheckoutResultDto implements CheckoutResult {
  order: OrderDto;
  clientSecret: string | null;
}

const _assertExact: ExactData<CheckoutResult, CheckoutResultDto> = true;
