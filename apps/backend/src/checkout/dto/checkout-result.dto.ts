import { CheckoutResult, ExactData, Order } from '@unlockit/shared';
import { OrderDetailDto } from 'src/orders/dto/order-detail.dto';

export class CheckoutResultDto implements CheckoutResult {
  order: Order;
  clientSecret: string | null;

  static fromOrder(
    order: OrderDetailDto,
    clientSecret: string | null,
  ): CheckoutResultDto {
    const dto = new CheckoutResultDto();
    dto.order = order;
    dto.clientSecret = clientSecret;
    return dto;
  }
}

const _assertExact: ExactData<CheckoutResult, CheckoutResultDto> = true;
