import { applyDecorators } from '@nestjs/common';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { PaginatedDtoSchemaDoc } from '../common/dto/paginated.dto.doc';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { UpdateTagDto } from 'src/tags/dto/update-tag.dto';
import { GameTagDto } from 'src/tags/dto/game-tag.dto';
import { TagDto } from 'src/tags/dto/tag.dto';

const TAG_ID_PARAM = ApiParam({
  name: 'id',
  type: Number,
  description: 'Numeric ID of the tag.',
  example: 1,
});

export const TagsControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Tags')),

  Create: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({ summary: 'Create a tag', description: 'Admin only.' }),
      ApiBody({ type: CreateTagDto }),
      ApiCreatedResponse({ description: 'Tag created.', type: TagDto }),
      ApiConflictResponse({
        description: 'A tag with this name already exists.',
      }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List all tags',
        description: 'Public endpoint. Returns a paginated list of all tags.',
      }),
      ApiExtraModels(PaginatedDto, TagDto),
      ApiOkResponse({
        description: 'Paginated list of tags.',
        schema: {
          type: 'array',
          items: PaginatedDtoSchemaDoc(TagDto),
        },
      }),
      ApiBadRequestResponse({ description: 'Invalid pagination parameters.' }),
    ),

  Update: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({ summary: 'Update a tag', description: 'Admin only.' }),
      TAG_ID_PARAM,
      ApiBody({ type: UpdateTagDto }),
      ApiOkResponse({ description: 'Tag updated.' }),
      ApiNotFoundResponse({ description: 'Tag not found.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  Remove: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Delete a tag',
        description: 'Admin only. Cascade-unlinks from all games.',
      }),
      TAG_ID_PARAM,
      ApiNoContentResponse({ description: 'Tag deleted.' }),
      ApiNotFoundResponse({ description: 'Tag not found.' }),
    ),
};
