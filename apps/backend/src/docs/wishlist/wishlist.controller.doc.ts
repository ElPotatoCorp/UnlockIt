import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { GAME_ID_PARAM } from 'src/docs/common/api-params';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { PaginatedDtoSchemaDoc } from 'src/docs/common/dto/paginated.dto.doc';
import { WishlistDto } from 'src/wishlist/dto/wishlist.dto';

export const WishlistControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Wishlist'), ApiAuth()),

  // GET /wishlist
  Index: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List wishlisted games',
        description:
          "Returns a paginated list of the authenticated user's wishlisted games.",
      }),
      ApiExtraModels(PaginatedDto, WishlistDto),
      ApiOkResponse({
        description: 'Paginated list of wishlisted games.',
        schema: PaginatedDtoSchemaDoc(WishlistDto),
      }),
      ApiBadRequestResponse({
        description: 'Invalid pagination parameters.',
      }),
    ),

  // GET /wishlist/:id
  IsInWishlist: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Check whether a game is wishlisted',
        description:
          'Returns whether the authenticated user has the given game in their wishlist.',
      }),
      GAME_ID_PARAM,
      ApiOkResponse({
        description: 'Wishlist status for the game.',
        schema: {
          properties: { wishlisted: { type: 'boolean' } },
          example: { wishlisted: true },
        },
      }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
    ),

  // POST /wishlist/:id
  Add: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Add a game to the wishlist',
        description:
          'Idempotent — adding an already-wishlisted game is a no-op.',
      }),
      GAME_ID_PARAM,
      ApiCreatedResponse({ description: 'Game added to wishlist.' }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
    ),

  // DELETE /wishlist/:id
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remove a game from the wishlist',
        description: 'Idempotent.',
      }),
      GAME_ID_PARAM,
      ApiNoContentResponse({ description: 'Game removed from wishlist.' }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
    ),
};
