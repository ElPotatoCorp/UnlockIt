import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { PaginatedDto } from "src/common/dto/paginated.dto";
import { PublicUser } from "src/user/entities/public-user.entity";

export const UsersControllerDoc = {
  Controller: () => applyDecorators(
    ApiTags('Users'),
  ),

  Index: () => applyDecorators(
    ApiExtraModels(PaginatedDto, PublicUser),
    ApiOperation({
      summary: 'Get a paginated list of users',
      description: 'Returns a paginated list of public user profiles. Use `page` and `limit` to control pagination.',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of users per page (default: 10, max: 100)',
      example: 10,
    }),
    ApiOkResponse({
      description: 'Paginated list of users successfully retrieved.',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(PublicUser) },
              },
            },
          },
        ],
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid pagination parameters (e.g. page or limit is not a number).',
    }),
  ),

  GetOne: () => applyDecorators(
    ApiOperation({
      summary: 'Get a user by ID',
      description: 'Returns the public profile of a single user identified by their UUID.',
    }),
    ApiParam({
      name: 'id',
      required: true,
      type: String,
      description: 'UUID of the user to retrieve',
      example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    }),
    ApiOkResponse({
      description: 'User successfully retrieved.',
      type: PublicUser,
    }),
    ApiBadRequestResponse({
      description: 'Invalid UUID format.',
    }),
    ApiNotFoundResponse({
      description: 'No user found with the specified ID.',
    }),
  ),
}