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
import { PaginatedDtoSchemaDoc } from 'src/docs/common/dto/paginated.dto.doc';
import { CreateSeriesDto } from 'src/series/dto/create-series.dto';
import { UpdateSeriesDto } from 'src/series/dto/update-series.dto';
import { ModifyGamesInSerieDto } from 'src/series/dto/modify-games-in-serie.dto';
import { SummarySeriesDto } from 'src/series/dto/summary-series.dto';

const SERIES_ID_PARAM = ApiParam({
  name: 'id',
  type: Number,
  description: 'Numeric ID of the series.',
  example: 1,
});

export const SeriesControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Series')),

  // POST /series
  Create: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Create a series',
        description:
          'Admin only. Creates a new game series. Games can optionally be linked at creation time.',
      }),
      ApiBody({ type: CreateSeriesDto }),
      ApiCreatedResponse({
        description: 'Series created successfully.',
        type: SummarySeriesDto,
      }),
      ApiBadRequestResponse({
        description: 'Validation failed.',
      }),
    ),

  // GET /series
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List all series',
        description:
          'Returns a paginated list of series with their associated games. Public endpoint.',
      }),
      ApiExtraModels(PaginatedDto, SummarySeriesDto),
      ApiOkResponse({
        description: 'Paginated list of series.',
        schema: PaginatedDtoSchemaDoc(SummarySeriesDto),
      }),
      ApiBadRequestResponse({
        description: 'Invalid pagination parameters.',
      }),
    ),

  // GET /series/:id
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get a series by ID',
        description:
          'Returns a single series with its associated games. Public endpoint.',
      }),
      SERIES_ID_PARAM,
      ApiOkResponse({
        description: 'Series found.',
        type: SummarySeriesDto,
      }),
      ApiNotFoundResponse({
        description: 'No series found with the specified ID.',
      }),
      ApiBadRequestResponse({
        description: 'ID is not a valid number.',
      }),
    ),

  // GET /series/by-slug/:slug
  FindOneBySlug: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get a series by slug',
        description:
          'Returns a single series matched by its URL slug. Public endpoint.',
      }),
      ApiParam({
        name: 'slug',
        type: String,
        description: 'URL slug of the series.',
        example: 'call-of-duty-black-ops',
      }),
      ApiOkResponse({
        description: 'Series found.',
        type: SummarySeriesDto,
      }),
      ApiNotFoundResponse({
        description: 'No series found with the specified slug.',
      }),
    ),

  // PATCH /series/:id
  Update: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Update a series',
        description:
          'Admin only. All fields are optional — only send what needs to change. To add or remove games, use the dedicated game management endpoints.',
      }),
      SERIES_ID_PARAM,
      ApiBody({ type: UpdateSeriesDto }),
      ApiNoContentResponse({
        description: 'Series updated successfully.',
      }),
      ApiNotFoundResponse({
        description: 'No series found with the specified ID.',
      }),
      ApiBadRequestResponse({
        description: 'Validation failed.',
      }),
    ),

  // PATCH /series/:id/games
  AddGames: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Add games to a series',
        description:
          'Admin only. Links one or more games to this series by their IDs. Already-linked games are ignored (idempotent).',
      }),
      SERIES_ID_PARAM,
      ApiBody({
        type: ModifyGamesInSerieDto,
        description: 'List of numeric game IDs to add.',
      }),
      ApiNoContentResponse({
        description: 'Games added successfully.',
      }),
      ApiNotFoundResponse({
        description: 'No series found with the specified ID.',
      }),
      ApiBadRequestResponse({
        description: 'Validation failed or one or more game IDs do not exist.',
      }),
    ),

  // DELETE /series/:id
  Remove: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Delete a series',
        description:
          'Admin only. Permanently deletes the series. Games belonging to this series will have their series_id set to null (no cascade delete on games).',
      }),
      SERIES_ID_PARAM,
      ApiNoContentResponse({
        description: 'Series deleted successfully.',
      }),
      ApiNotFoundResponse({
        description: 'No series found with the specified ID.',
      }),
    ),

  // DELETE /series/:id/games
  RemoveGames: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Remove games from a series',
        description:
          'Admin only. Unlinks one or more games from this series. Games themselves are not deleted. Already-unlinked games are ignored (idempotent).',
      }),
      SERIES_ID_PARAM,
      ApiBody({
        type: ModifyGamesInSerieDto,
        description: 'List of numeric game IDs to remove.',
      }),
      ApiNoContentResponse({
        description: 'Games removed successfully.',
      }),
      ApiNotFoundResponse({
        description: 'No series found with the specified ID.',
      }),
      ApiBadRequestResponse({
        description: 'Validation failed.',
      }),
    ),
};
