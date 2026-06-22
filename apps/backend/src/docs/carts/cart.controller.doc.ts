import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { GAME_ID_PARAM } from 'src/docs/common/api-params';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { PaginatedDtoSchemaDoc } from 'src/docs/common/dto/paginated.dto.doc';
import { CartItemDto } from 'src/cart/dto/cart-items.dto';

export const CartControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Cart'), ApiAuth()),

  // GET /cart
  Get: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List cart contents',
        description:
          "Returns a paginated list of the authenticated user's cart items.",
      }),
      ApiExtraModels(PaginatedDto, CartItemDto),
      ApiOkResponse({
        description: 'Paginated list of cart items.',
        schema: PaginatedDtoSchemaDoc(CartItemDto),
      }),
      ApiBadRequestResponse({
        description: 'Invalid pagination parameters.',
      }),
    ),

  // GET /cart/total
  Total: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get cart total',
        description: 'Returns the total price of the cart, excluding taxes.',
      }),
      ApiOkResponse({
        description: 'Total price.',
        schema: {
          properties: {
            total: {
              type: 'number',
              example: 49.99,
            },
          },
        },
      }),
    ),

  // POST /cart/:id/toggle
  Toggle: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Toggle a cart item selection',
        description:
          'Flips the `selected` flag for the item. Pass `state` to force a specific value instead of flipping it.',
      }),
      GAME_ID_PARAM,
      ApiQuery({
        name: 'state',
        type: Boolean,
        required: false,
        description: 'Force `selected` to this value instead of toggling it.',
        example: true,
      }),
      ApiNoContentResponse({ description: 'Selection state updated.' }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
    ),

  // POST /cart/:id
  Add: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Add a game to the cart',
        description:
          'Adds the game to the cart, or increases its quantity if already present.',
      }),
      GAME_ID_PARAM,
      ApiQuery({
        name: 'quantity',
        type: Number,
        required: false,
        description: 'Quantity to add. Defaults to 1.',
        example: 1,
      }),
      ApiNoContentResponse({ description: 'Game added to cart.' }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
    ),

  // DELETE /cart/:id
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remove a game from the cart',
        description:
          'Decreases the quantity by the given amount, removing the item entirely once it reaches zero.',
      }),
      GAME_ID_PARAM,
      ApiQuery({
        name: 'quantity',
        type: Number,
        required: false,
        description: 'Quantity to remove. Defaults to 1.',
        example: 1,
      }),
      ApiNoContentResponse({
        description: 'Quantity decreased or item removed.',
      }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
    ),

  // DELETE /cart/clear
  Clear: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Empty the cart',
        description: 'Removes all items from the cart.',
      }),
      ApiOkResponse({ description: 'Cart cleared.' }),
    ),
};
