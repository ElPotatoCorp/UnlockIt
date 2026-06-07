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
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { PaginatedDtoSchemaDoc } from '../common/dto/paginated.dto.doc';
import { PublisherEntity } from 'src/publishers/entities/publisher.entity';
import { CreatePublisherDto } from 'src/publishers/dto/create-publisher.dto';
import { UpdatePublisherDto } from 'src/publishers/dto/update-publisher.dto';

const PUB_ID_PARAM = ApiParam({
  name: 'id',
  type: Number,
  description: 'Numeric ID of the publisher.',
  example: 1,
});

export const PublishersControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Publishers')),

  Create: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Create a publisher',
        description: 'Admin only.',
      }),
      ApiBody({ type: CreatePublisherDto }),
      ApiCreatedResponse({
        description: 'Publisher created.',
        type: PublisherEntity,
      }),
      ApiConflictResponse({
        description: 'A publisher with this name already exists.',
      }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List all publishers',
        description: 'Public endpoint.',
      }),
      ApiExtraModels(PaginatedDto, PublisherEntity),
      ApiOkResponse({
        description: 'Paginated list of publishers.',
        schema: PaginatedDtoSchemaDoc(PublisherEntity),
      }),
      ApiBadRequestResponse({ description: 'Invalid pagination parameters.' }),
    ),

  Update: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Update a publisher',
        description: 'Admin only.',
      }),
      PUB_ID_PARAM,
      ApiBody({ type: UpdatePublisherDto }),
      ApiOkResponse({ description: 'Publisher updated.' }),
      ApiNotFoundResponse({ description: 'Publisher not found.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  Remove: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Delete a publisher',
        description: 'Admin only. Cascade-unlinks from all games.',
      }),
      PUB_ID_PARAM,
      ApiNoContentResponse({ description: 'Publisher deleted.' }),
      ApiNotFoundResponse({ description: 'Publisher not found.' }),
    ),
};
