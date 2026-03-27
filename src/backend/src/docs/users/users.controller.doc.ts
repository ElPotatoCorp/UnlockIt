import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginatedDtoOf } from "src/common/dto/paginated.dto";
import { PublicUser } from "src/user/entities/public-user.entity";

export const UsersControllerDoc = {
  Controller: () => applyDecorators(
    ApiTags('Users'),
  ),

  Index: () => applyDecorators(
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
    ApiResponse({
      status: 200,
      description: 'Paginated list of users successfully retrieved.',
      type: PaginatedDtoOf(PublicUser),
    }),
    ApiResponse({
      status: 400,
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
    ApiResponse({
      status: 200,
      description: 'User successfully retrieved.',
      type: PublicUser,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid UUID format.',
    }),
    ApiResponse({
      status: 404,
      description: 'No user found with the specified ID.',
    }),
  ),
}