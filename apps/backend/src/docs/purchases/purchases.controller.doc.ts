import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { GAME_ID_PARAM } from 'src/docs/common/api-params';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { PaginatedDtoSchemaDoc } from 'src/docs/common/dto/paginated.dto.doc';
import { PurchaseDto } from 'src/purchases/dto/purchase.dto';
import { PurchaseSummaryDto } from 'src/purchases/dto/purchase-summary.dto';
import { PurchaseKeysDto } from 'src/purchases/dto/purchase-keys.dto';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';

const ORDER_ID_PARAM = ApiParam({
  name: 'orderId',
  type: String,
  format: 'uuid',
  description: 'UUID of the order.',
  example: 'a3f1c2d4-b5e7-4f9c-8d3a-1e2f3b4c5d6e',
});

export const PurchasesControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Purchases'), ApiAuth()),

  // GET /purchases
  Index: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List own purchases',
        description:
          "Returns a paginated list of the authenticated user's purchases — one entry per ordered game.",
      }),
      ApiExtraModels(PaginatedDto, PurchaseSummaryDto),
      ApiOkResponse({
        description: 'Paginated list of purchases.',
        schema: PaginatedDtoSchemaDoc(PurchaseSummaryDto),
      }),
      ApiBadRequestResponse({
        description: 'Invalid pagination parameters.',
      }),
    ),

  // GET /purchases/:orderId/:gameId
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get a single purchase',
        description:
          'Returns full purchase detail, including the review left for it, if any.',
      }),
      ORDER_ID_PARAM,
      GAME_ID_PARAM,
      ApiOkResponse({ description: 'Purchase found.', type: PurchaseDto }),
      ApiNotFoundResponse({
        description:
          'No purchase found for this order and game, or it does not belong to the authenticated user.',
      }),
      ApiBadRequestResponse({
        description: 'orderId is not a valid UUID, or gameId is not a valid number.',
      }),
    ),

  // GET /purchases/:orderId/:gameId/keys
  FindKeys: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get keys for a purchase',
        description: 'Returns the product keys delivered for this purchase.',
      }),
      ORDER_ID_PARAM,
      GAME_ID_PARAM,
      ApiOkResponse({ description: 'Product keys.', type: PurchaseKeysDto }),
      ApiNotFoundResponse({
        description:
          'No purchase found for this order and game, or it does not belong to the authenticated user.',
      }),
      ApiBadRequestResponse({
        description: 'orderId is not a valid UUID, or gameId is not a valid number.',
      }),
    ),

    // POST /purchases/:orderId/:gameId/review
  AddReview: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Leave a review for a purchased game',
        description:
          'Creates a review for this purchase. Use PATCH to edit an existing one instead.',
      }),
      ORDER_ID_PARAM,
      GAME_ID_PARAM,
      ApiBody({ type: CreateReviewDto }),
      ApiCreatedResponse({ description: 'Review created.' }),
      ApiNotFoundResponse({
        description:
          'No purchase found for this order and game, or it does not belong to the authenticated user.',
      }),
      ApiConflictResponse({
        description: 'A review already exists for this purchase.',
      }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  // PATCH /purchases/:orderId/:gameId/review
  UpdateReview: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update own review for a purchase',
        description: 'Updates the review previously left for this purchase.',
      }),
      ORDER_ID_PARAM,
      GAME_ID_PARAM,
      ApiBody({ type: UpdateReviewDto }),
      ApiOkResponse({ description: 'Review updated.' }),
      ApiNotFoundResponse({
        description:
          'No review exists yet for this purchase, or the purchase itself was not found.',
      }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  // DELETE /purchases/:orderId/:gameId/review
  RemoveReview: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remove own review for a purchase',
        description: 'Deletes the review left for this purchase.',
      }),
      ORDER_ID_PARAM,
      GAME_ID_PARAM,
      ApiOkResponse({ description: 'Review removed.' }),
      ApiNotFoundResponse({
        description: 'No review exists for this purchase.',
      }),
    ),
};