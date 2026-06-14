import { Body, Controller, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { User } from 'src/user/decorators/user.decorator';
import { InitiateCheckoutDto } from './dto/initiate-checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  initiate(
    @User('sub') userId: string,
    @User('cartId') cartId: string,
    @Body() dto: InitiateCheckoutDto,
  ) {
    return this.checkoutService.initiate(userId, cartId, dto);
  }
}
