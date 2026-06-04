import { applyDecorators } from '@nestjs/common';
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
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { CreateGameDto } from 'src/games/dto/create-game.dto';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { UpdateGameDto } from 'src/games/dto/update-game.dto';
import { PaginatedDtoSchemaDoc } from '../common/dto/paginated.dto.doc';
import { Game } from 'src/games/entities/game.entity';
import { BulkIdsDto } from 'src/common/dto/bulk-ids.dto';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';

const GAME_ID_PARAM  = ApiParam({ name: 'id',           type: Number, description: 'Numeric ID of the game.',       example: 42 });
const TAG_ID_PARAM_G = ApiParam({ name: 'tagId',        type: Number, description: 'Numeric ID of the tag.',        example: 1  });
const DEV_ID_PARAM_G = ApiParam({ name: 'developerId',  type: Number, description: 'Numeric ID of the developer.',  example: 1  });
const PUB_ID_PARAM_G = ApiParam({ name: 'publisherId',  type: Number, description: 'Numeric ID of the publisher.',  example: 1  });
const MED_ID_PARAM_G = ApiParam({ name: 'mediaId',      type: Number, description: 'Numeric ID of the media item.', example: 1 });

export const GamesControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Games')),

  // POST /games
  Create: () =>
    applyDecorators(
      ApiAuth(),
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
        type: Game,
      }),
      ApiBadRequestResponse({
        description:
          'Validation failed on text fields, missing required images, or unsupported image format.',
      }),
    ),

  // GET /games
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

  // GET /games/:id
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
        type: Game,
      }),
      ApiNotFoundResponse({
        description: 'No game found with the specified ID.',
      }),
      ApiBadRequestResponse({
        description: 'ID is not a valid number.',
      }),
    ),

  // PATCH /games/:id
  Update: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Update a game',
        description:
          'Admin only. All fields are optional — only send what needs to change.',
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

  // DELETE /games/:id
  Remove: () =>
    applyDecorators(
      ApiAuth(),
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

    // Tags
  AddTag: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Add a tag to a game', description: 'Admin only. Idempotent — adding an already-linked tag is a no-op.' }),
    GAME_ID_PARAM, TAG_ID_PARAM_G,
    ApiOkResponse({ description: 'Tag linked to game.' }),
    ApiNotFoundResponse({ description: 'Game or tag not found.' }),
  ),

  RemoveTag: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Remove a tag from a game', description: 'Admin only. Idempotent.' }),
    GAME_ID_PARAM, TAG_ID_PARAM_G,
    ApiOkResponse({ description: 'Tag unlinked from game.' }),
    ApiNotFoundResponse({ description: 'Game or tag not found.' }),
  ),

  SetTags: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Replace all tags on a game', description: 'Admin only. Replaces the entire tag list. Send an empty array to remove all tags.' }),
    GAME_ID_PARAM,
    ApiBody({ type: BulkIdsDto, description: 'Array of tag IDs to set.' }),
    ApiOkResponse({ description: 'Tags replaced.' }),
    ApiNotFoundResponse({ description: 'Game not found.' }),
  ),

  // Developers
  AddDeveloper: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Add a developer to a game', description: 'Admin only. Idempotent.' }),
    GAME_ID_PARAM, DEV_ID_PARAM_G,
    ApiOkResponse({ description: 'Developer linked to game.' }),
    ApiNotFoundResponse({ description: 'Game or developer not found.' }),
  ),

  RemoveDeveloper: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Remove a developer from a game', description: 'Admin only. Idempotent.' }),
    GAME_ID_PARAM, DEV_ID_PARAM_G,
    ApiOkResponse({ description: 'Developer unlinked from game.' }),
    ApiNotFoundResponse({ description: 'Game or developer not found.' }),
  ),

  SetDevelopers: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Replace all developers on a game', description: 'Admin only. Replaces the entire developer list.' }),
    GAME_ID_PARAM,
    ApiBody({ type: BulkIdsDto, description: 'Array of developer IDs to set.' }),
    ApiOkResponse({ description: 'Developers replaced.' }),
    ApiNotFoundResponse({ description: 'Game not found.' }),
  ),

  // Publishers
  AddPublisher: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Add a publisher to a game', description: 'Admin only. Idempotent.' }),
    GAME_ID_PARAM, PUB_ID_PARAM_G,
    ApiOkResponse({ description: 'Publisher linked to game.' }),
    ApiNotFoundResponse({ description: 'Game or publisher not found.' }),
  ),

  RemovePublisher: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Remove a publisher from a game', description: 'Admin only. Idempotent.' }),
    GAME_ID_PARAM, PUB_ID_PARAM_G,
    ApiOkResponse({ description: 'Publisher unlinked from game.' }),
    ApiNotFoundResponse({ description: 'Game or publisher not found.' }),
  ),

  SetPublishers: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Replace all publishers on a game', description: 'Admin only. Replaces the entire publisher list.' }),
    GAME_ID_PARAM,
    ApiBody({ type: BulkIdsDto, description: 'Array of publisher IDs to set.' }),
    ApiOkResponse({ description: 'Publishers replaced.' }),
    ApiNotFoundResponse({ description: 'Game not found.' }),
  ),

  // Platforms
  UpsertPlatforms: () => applyDecorators(
    ApiAuth(),
    ApiOperation({
      summary: 'Update platform availability for a game',
      description: 'Admin only. Partial update — only send the flags you want to change. Creates the platform row if it does not exist yet.',
    }),
    GAME_ID_PARAM,
    ApiBody({ type: UpdatePlatformDto }),
    ApiOkResponse({ description: 'Platform flags updated.' }),
    ApiNotFoundResponse({ description: 'Game not found.' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
  ),

  // Media
  AddMedia: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Add a media item to a game', description: 'Admin only. Provide the URL and type (video or image).' }),
    GAME_ID_PARAM,
    ApiBody({ type: CreateMediaDto }),
    ApiCreatedResponse({ description: 'Media item added.' }),
    ApiNotFoundResponse({ description: 'Game not found.' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
  ),

  RemoveMedia: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Remove a media item from a game', description: 'Admin only.' }),
    GAME_ID_PARAM, MED_ID_PARAM_G,
    ApiNoContentResponse({ description: 'Media item removed.' }),
    ApiNotFoundResponse({ description: 'Game or media item not found.' }),
  ),
};
