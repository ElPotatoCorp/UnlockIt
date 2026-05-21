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
};
