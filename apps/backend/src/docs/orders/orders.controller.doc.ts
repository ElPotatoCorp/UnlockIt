import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { PaginatedDtoSchemaDoc } from 'src/docs/common/dto/paginated.dto.doc';
import { OrderSummaryDto } from 'src/orders/dto/summary-order.dto';
import { OrderDto } from 'src/orders/dto/order.dto';

const ORDER_ID_PATH_PARAM = ApiParam({
  name: 'id',
  type: String,
  format: 'uuid',
  description: 'UUID of the order.',
  example: 'a3f1c2d4-b5e7-4f9c-8d3a-1e2f3b4c5d6e',
});

export const OrdersControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Orders'), ApiAuth()),

  // GET /orders
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List own orders',
        description:
          "Returns a paginated list of the authenticated user's orders.",
      }),
      ApiExtraModels(PaginatedDto, OrderSummaryDto),
      ApiOkResponse({
        description: 'Paginated list of orders.',
        schema: PaginatedDtoSchemaDoc(OrderSummaryDto),
      }),
      ApiBadRequestResponse({ description: 'Invalid pagination parameters.' }),
    ),

  // GET /orders/:id
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get a single order',
        description: 'Returns full order detail, including line items.',
      }),
      ORDER_ID_PATH_PARAM,
      ApiOkResponse({ description: 'Order found.', type: OrderDto }),
      ApiNotFoundResponse({
        description:
          'No order found with the specified ID, or it does not belong to the authenticated user.',
      }),
      ApiBadRequestResponse({ description: 'id is not a valid UUID.' }),
    ),
};
