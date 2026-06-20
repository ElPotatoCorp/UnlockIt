import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { InitiateCheckoutDto } from 'src/checkout/dto/initiate-checkout.dto';
import { CheckoutResultDto } from 'src/checkout/dto/checkout-result.dto';

export const CheckoutControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Checkout'), ApiAuth()),

  // POST /checkout
  Initiate: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Initiate checkout',
        description:
          'Reserves stock for all selected cart items and creates an order. If `useWallet` is true, the wallet balance is applied first and any remainder is charged via Stripe; if false, the full amount goes to Stripe. On success the cart is cleared and `clientSecret` is returned for the client to confirm payment with, if applicable.\n\n' +
          '**Current limitation:** Stripe is not yet integrated. Any checkout not fully covered by wallet balance currently fails with 501, and `clientSecret` is always null on success.',
      }),
      ApiBody({ type: InitiateCheckoutDto }),
      ApiCreatedResponse({
        description:
          'Order created and fully paid from wallet balance. clientSecret is null.',
        type: CheckoutResultDto,
      }),
      ApiBadRequestResponse({
        description: 'No items are currently selected in the cart.',
      }),
      ApiNotFoundResponse({
        description:
          'The authenticated user could not be found. Should not normally occur for a valid session.',
      }),
      ApiConflictResponse({
        description: 'Insufficient stock for one or more items in the cart.',
        schema: {
          example: {
            message: 'Insufficient stock for one or more items.',
            items: [{ gameId: 42, requested: 3, available: 1 }],
          },
        },
      }),
      ApiNotImplementedResponse({
        description:
          'Stripe is not yet integrated. Returned whenever the order is not fully covered by wallet balance.',
      }),
    ),
};