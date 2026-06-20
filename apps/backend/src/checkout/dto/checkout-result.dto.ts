import { ApiProperty } from '@nestjs/swagger';
import { CheckoutResult, ExactData } from '@unlockit/shared';
import { OrderDto } from 'src/orders/dto/order.dto';

export class CheckoutResultDto implements CheckoutResult {
  @ApiProperty({
    title: 'Order',
    type: OrderDto,
  })
  order: OrderDto;

  @ApiProperty({
    title: 'Client Secret',
    description: 'The secret returned by Stripe',
    type: String,
    nullable: true,
    example: null,
  })
  clientSecret: string | null;
}

const _assertExact: ExactData<CheckoutResult, CheckoutResultDto> = true;
