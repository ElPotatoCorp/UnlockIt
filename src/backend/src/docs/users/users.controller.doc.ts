import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { PaginatedDto } from "src/common/dto/paginated.dto";
import { PublicUserDto } from "src/user/dto/public-user.dto";

export const UsersControllerDoc = {
  Controller: () => applyDecorators(
    ApiTags('Users'),
  ),

  Index: () => applyDecorators(
    ApiExtraModels(PaginatedDto),
    ApiOperation({
      summary: 'Get a paginated list of users',
      description: 'Returns a paginated list of public user profiles. Use `page` and `limit` to control pagination.',
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
                items: { $ref: getSchemaPath(PublicUserDto) },
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
      example: '08dbd076-c3d8-46d4-bb0d-ebedc8bebd1f',
    }),
    ApiOkResponse({
      description: 'User successfully retrieved.',
      type: PublicUserDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid UUID format.',
    }),
    ApiNotFoundResponse({
      description: 'No user found with the specified ID.',
    }),
  ),
}