import { applyDecorators } from '@nestjs/common';
import {
  ApiAuth,
} from 'src/docs/auth/decorators/api-auth.decorator';
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
import { DeveloperEntity } from 'src/developers/entities/developer.entity';
import { CreateDeveloperDto } from 'src/developers/dto/create-developer.dto';
import { UpdateDeveloperDto } from 'src/developers/dto/update-developer.dto';

const DEV_ID_PARAM = ApiParam({ name: 'id', type: Number, description: 'Numeric ID of the developer.', example: 1 });

export const DevelopersControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Developers')),

  Create: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Create a developer', description: 'Admin only.' }),
    ApiBody({ type: CreateDeveloperDto }),
    ApiCreatedResponse({ description: 'Developer created.', type: DeveloperEntity }),
    ApiConflictResponse({ description: 'A developer with this name already exists.' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
  ),

  FindAll: () => applyDecorators(
    ApiOperation({ summary: 'List all developers', description: 'Public endpoint.' }),
    ApiExtraModels(PaginatedDto, DeveloperEntity),
    ApiOkResponse({ description: 'Paginated list of developers.', schema: PaginatedDtoSchemaDoc(DeveloperEntity) }),
    ApiBadRequestResponse({ description: 'Invalid pagination parameters.' }),
  ),

  Update: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Update a developer', description: 'Admin only.' }),
    DEV_ID_PARAM,
    ApiBody({ type: UpdateDeveloperDto }),
    ApiOkResponse({ description: 'Developer updated.' }),
    ApiNotFoundResponse({ description: 'Developer not found.' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
  ),

  Remove: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Delete a developer', description: 'Admin only. Cascade-unlinks from all games.' }),
    DEV_ID_PARAM,
    ApiNoContentResponse({ description: 'Developer deleted.' }),
    ApiNotFoundResponse({ description: 'Developer not found.' }),
  ),
};