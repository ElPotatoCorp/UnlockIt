import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { CreateGameDto } from 'src/games/dto/create-game.dto';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { UpdateGameDto } from 'src/games/dto/update-game.dto';
import { PaginatedDtoSchemaDoc } from '../common/dto/paginated.dto.doc';
import { GameEntity } from 'src/games/entities/game.entity';
import { BulkIdsDto } from 'src/common/dto/bulk-ids.dto';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';
import { SearchBodyDto } from 'src/games/dto/search-game-options.dto';
import { GameDetailDto } from 'src/games/dto/game-detail.dto';
import { StockDto } from 'src/stocks/dto/stock.dto';
import { EmployeeRole } from '@unlockit/shared';
import { CreateStockDto } from 'src/stocks/dto/create-stock.dto';
import { ReviewDto } from 'src/reviews/dto/review.dto';

const GAME_ID_PARAM = ApiParam({
  name: 'id',
  type: Number,
  description: 'Numeric ID of the game.',
  example: 42,
});
const TAG_ID_PARAM_G = ApiParam({
  name: 'tagId',
  type: Number,
  description: 'Numeric ID of the tag.',
  example: 1,
});
const DEV_ID_PARAM_G = ApiParam({
  name: 'developerId',
  type: Number,
  description: 'Numeric ID of the developer.',
  example: 1,
});
const PUB_ID_PARAM_G = ApiParam({
  name: 'publisherId',
  type: Number,
  description: 'Numeric ID of the publisher.',
  example: 1,
});
const MED_ID_PARAM_G = ApiParam({
  name: 'mediaId',
  type: Number,
  description: 'Numeric ID of the media item.',
  example: 1,
});

export const GamesControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Games')),

  // POST /games/:id/POST /games
  Create: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.ADMIN),
      ApiOperation({
        summary: 'Create a game',
        description: 'Admin only. All text fields in a single request.',
      }),
      ApiBody({
        description: `All game fields except ID.`,
        type: CreateGameDto,
      }),
      ApiCreatedResponse({
        description: 'Game created successfully.',
        type: GameEntity,
      }),
      ApiBadRequestResponse({
        description:
          'Validation failed on text fields, missing required images, or unsupported image format.',
      }),
    ),

  // POST /games/:id/GET /games/search/:slug
  Search: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Search games',
        description:
          'Returns a paginated list of game summaries matching the given slug and optional filters. Public endpoint.',
      }),
      ApiParam({
        name: 'slug',
        type: String,
        required: false,
        description:
          'URL-friendly game name to search for (e.g. "call-of-duty"). Automatically slugified.',
        example: 'call-of-duty',
      }),
      ApiQuery({
        name: 'page',
        type: Number,
        required: false,
        description: 'Page number (&ge; 1). Defaults to 1.',
        example: 1,
      }),
      ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
        description: 'Items per page (1-100). Defaults to 20.',
        example: 20,
      }),
      ApiBody({
        description:
          'Optional search filters and sort order. All fields except `order.by` are optional.',
        type: SearchBodyDto,
        examples: {
          standardExample: {
            summary: 'Standard Filters',
            value: {
              price: {
                min: 0,
                max: 60
              },
              order: {
                by: "popular",
                asc: true
              },
            },
          },
          complexExample: {
            summary: 'Complex Filters',
            value: {
              type: "game",
              price: {
                min: 0,
                max: 60
              },
              release: {
                when: "after",
                date: "2024-01-01"
              },
              order: {
                by: "popular",
                asc: true
              },
              tags: [1,2,5],
              developers: [10,15],
              publishers: [3,7],
              platforms: {
                windows: true,
                ps5: true,
              },
            }
          }
        },
      }),
      ApiExtraModels(PaginatedDto, SummaryGameDto),
      ApiOkResponse({
        description: 'Paginated list of matching game summaries.',
        schema: PaginatedDtoSchemaDoc(SummaryGameDto),
      }),
      ApiBadRequestResponse({
        description: 'Invalid slug, pagination parameters, or filter values.',
      }),
    ),

  // POST /games/:id/GET /games
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List games',
        description:
          'Returns a paginated list of game summaries. Public endpoint.',
      }),
      ApiExtraModels(PaginatedDto, SummaryGameDto),
      ApiOkResponse({
        description: 'Paginated list of games.',
        schema: PaginatedDtoSchemaDoc(SummaryGameDto),
      }),
      ApiBadRequestResponse({
        description: 'Invalid pagination parameters.',
      }),
    ),

  // POST /games/:id/GET /games/:id
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get a game by ID',
        description:
          'Returns the full game detail including all fields. Public endpoint.',
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Numeric ID of the game.',
        example: 42,
      }),
      ApiOkResponse({
        description: 'Game found.',
        type: GameDetailDto,
      }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
      ApiBadRequestResponse({
        description: 'ID is not a valid number.',
      }),
    ),

  // POST /games/:id/PATCH /games/:id
  Update: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.ADMIN),
      ApiOperation({
        summary: 'Update a game',
        description:
          'Admin only. All fields are optional - only send what needs to change.',
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Numeric ID of the game to update.',
        example: 42,
      }),
      ApiBody({
        description: `Any subset of game fields.`,
        type: UpdateGameDto,
      }),
      ApiOkResponse({
        description: 'Game updated successfully.',
      }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
      ApiBadRequestResponse({
        description: 'Validation failed or unsupported image format.',
      }),
    ),

  // POST /games/:id/DELETE /games/:id
  Remove: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.SUPER_ADMIN),
      ApiOperation({
        summary: 'Delete a game',
        description:
          'Admin only. Permanently deletes the game and cascades to related records.',
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Numeric ID of the game to delete.',
        example: 42,
      }),
      ApiNoContentResponse({
        description: 'Game deleted successfully.',
      }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
    ),

  // POST /games/:id/Tags
  AddTag: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Add a tag to a game',
        description:
          'Admin only. Idempotent - adding an already-linked tag is a no-op.',
      }),
      GAME_ID_PARAM,
      TAG_ID_PARAM_G,
      ApiOkResponse({ description: 'Tag linked to game.' }),
      ApiNotFoundResponse({ description: 'Game or tag not found.' }),
    ),

  RemoveTag: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Remove a tag from a game',
        description: 'Admin only. Idempotent.',
      }),
      GAME_ID_PARAM,
      TAG_ID_PARAM_G,
      ApiOkResponse({ description: 'Tag unlinked from game.' }),
      ApiNotFoundResponse({ description: 'Game or tag not found.' }),
    ),

  SetTags: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Replace all tags on a game',
        description:
          'Admin only. Replaces the entire tag list. Send an empty array to remove all tags.',
      }),
      GAME_ID_PARAM,
      ApiBody({ type: BulkIdsDto, description: 'Array of tag IDs to set.' }),
      ApiOkResponse({ description: 'Tags replaced.' }),
      ApiNotFoundResponse({ description: 'Game not found.' }),
    ),

  // POST /games/:id/Developers
  AddDeveloper: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Add a developer to a game',
        description: 'Admin only. Idempotent.',
      }),
      GAME_ID_PARAM,
      DEV_ID_PARAM_G,
      ApiOkResponse({ description: 'Developer linked to game.' }),
      ApiNotFoundResponse({ description: 'Game or developer not found.' }),
    ),

  RemoveDeveloper: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Remove a developer from a game',
        description: 'Admin only. Idempotent.',
      }),
      GAME_ID_PARAM,
      DEV_ID_PARAM_G,
      ApiOkResponse({ description: 'Developer unlinked from game.' }),
      ApiNotFoundResponse({ description: 'Game or developer not found.' }),
    ),

  SetDevelopers: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Replace all developers on a game',
        description: 'Admin only. Replaces the entire developer list.',
      }),
      GAME_ID_PARAM,
      ApiBody({
        type: BulkIdsDto,
        description: 'Array of developer IDs to set.',
      }),
      ApiOkResponse({ description: 'Developers replaced.' }),
      ApiNotFoundResponse({ description: 'Game not found.' }),
    ),

  // POST /games/:id/Publishers
  AddPublisher: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Add a publisher to a game',
        description: 'Admin only. Idempotent.',
      }),
      GAME_ID_PARAM,
      PUB_ID_PARAM_G,
      ApiOkResponse({ description: 'Publisher linked to game.' }),
      ApiNotFoundResponse({ description: 'Game or publisher not found.' }),
    ),

  RemovePublisher: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Remove a publisher from a game',
        description: 'Admin only. Idempotent.',
      }),
      GAME_ID_PARAM,
      PUB_ID_PARAM_G,
      ApiOkResponse({ description: 'Publisher unlinked from game.' }),
      ApiNotFoundResponse({ description: 'Game or publisher not found.' }),
    ),

  SetPublishers: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Replace all publishers on a game',
        description: 'Admin only. Replaces the entire publisher list.',
      }),
      GAME_ID_PARAM,
      ApiBody({
        type: BulkIdsDto,
        description: 'Array of publisher IDs to set.',
      }),
      ApiOkResponse({ description: 'Publishers replaced.' }),
      ApiNotFoundResponse({ description: 'Game not found.' }),
    ),

  // POST /games/:id/Platforms
  UpdatePlatforms: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Update platform availability for a game',
        description:
          'Admin only. Partial update - only send the flags you want to change.',
      }),
      GAME_ID_PARAM,
      ApiBody({ type: UpdatePlatformDto }),
      ApiOkResponse({ description: 'Platform flags updated.' }),
      ApiNotFoundResponse({ description: 'Game not found.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  // POST /games/:id/Media
  AddMedia: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Add a media item to a game',
        description: 'Admin only. Provide the URL and type (video or image).',
      }),
      GAME_ID_PARAM,
      ApiBody({ type: CreateMediaDto }),
      ApiCreatedResponse({ description: 'Media item added.' }),
      ApiNotFoundResponse({ description: 'Game not found.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  RemoveMedia: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.MODERATOR),
      ApiOperation({
        summary: 'Remove a media item from a game',
        description: 'Admin only.',
      }),
      GAME_ID_PARAM,
      MED_ID_PARAM_G,
      ApiNoContentResponse({ description: 'Media item removed.' }),
      ApiNotFoundResponse({ description: 'Game or media item not found.' }),
    ),

  // POST /games/:id/GET /games/:id/reviews
  GetReviews: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List reviews for a game',
        description:
          'Returns a paginated list of reviews left on the game. Public endpoint.',
      }),
      GAME_ID_PARAM,
      ApiQuery({
        name: 'page',
        type: Number,
        required: false,
        description: 'Page number (&ge; 1). Defaults to 1.',
        example: 1,
      }),
      ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
        description: 'Items per page (1-100). Defaults to 20.',
        example: 20,
      }),
      ApiExtraModels(PaginatedDto, ReviewDto),
      ApiOkResponse({
        description: 'Paginated list of reviews.',
        schema: PaginatedDtoSchemaDoc(ReviewDto),
      }),
      ApiBadRequestResponse({
        description: 'Invalid pagination parameters.',
      }),
    ),

  // POST /games/:id/stocks
  AddStocks: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.SUPER_ADMIN),
      ApiOperation({
        summary: 'Add stock keys to a game',
        description:
          'Restricted to SUPER_ADMIN — bulk-inserts unredeemed product keys for the game. The entire batch is rejected if any key is duplicated within the payload or already exists in stock.',
      }),
      GAME_ID_PARAM,
      ApiBody({
        description: 'Array of product keys to add as stock.',
        type: CreateStockDto,
      }),
      ApiNoContentResponse({ description: 'Stock keys added successfully.' }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
      ApiUnprocessableEntityResponse({
        description:
          'One or more product keys are duplicated within the payload or already exist in stock.',
        schema: {
          example: {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'Unprocessable Entity',
            message: 'There are duplicated values in the payload',
            duplicatedValues: ['ABCD-1234-EFGH', 'WXYZ-5678-IJKL'],
          },
        },
      }),
    ),

  // GET /games/:id/stocks
  GetStocks: () =>
    applyDecorators(
      ApiAuth(EmployeeRole.SUPER_ADMIN),
      ApiOperation({
        summary: 'List stock keys for a game',
        description:
          'Returns a paginated list of stock entries for the game, including raw unredeemed product keys. Restricted to SUPER_ADMIN.',
      }),
      GAME_ID_PARAM,
      ApiQuery({
        name: 'page',
        type: Number,
        required: false,
        description: 'Page number (&ge; 1). Defaults to 1.',
        example: 1,
      }),
      ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
        description: 'Items per page (1-100). Defaults to 20.',
        example: 20,
      }),
      ApiExtraModels(PaginatedDto, StockDto),
      ApiOkResponse({
        description: 'Paginated list of stock entries.',
        schema: PaginatedDtoSchemaDoc(StockDto),
      }),
      ApiBadRequestResponse({
        description: 'Invalid pagination parameters.',
      }),
    ),
};
