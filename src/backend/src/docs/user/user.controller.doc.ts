import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, IntersectionType } from "@nestjs/swagger";
import { ApiAuth } from "../auth/decorators/api-auth.decorator";
import { MAX_AVATAR_SIZE } from "src/upload/upload.constants";
import { User } from "src/user/entities/user.entity";

export const UserControllerDoc = {
  Controller: () => applyDecorators(
    ApiTags('User'),
    ApiAuth() // All routes in this controller require authentication
  ),

  Index: () => applyDecorators(
    ApiOperation({ summary: 'Get the current user\'s profile' }),
    ApiResponse({
      status: 200,
      description: 'Returns the profile of the currently authenticated user (password excluded).',
      type: User,
      example: {
        id: 'a3f1c2d4-b5e7-4f9c-8d3a-1e2f3b4c5d6e',
        username: 'johndoe',
        email: 'jo***@example.com',
        phoneWzc: '33',
        phoneNumber: '123****90',
        bio: 'Just a regular user.',
        avatar: 'avatar-12345.jpg',
        wallet: 150.50,
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        billingAddress: '123 Main St, Anytown, USA',
        newsletterSubscribed: false,
        birthdayDate: '1990-01-01',
        creationDate: '2024-01-01'
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found.',
    }),
  ),

  Patch: () => applyDecorators(
    ApiOperation({ summary: 'Update the current user\'s profile' }),
    ApiBody({
      description: 'Fields to update in the user profile. All fields are optional, but at least one must be provided.',
      type: User,
      examples: {
        example1: {
          summary: 'Update bio and country',
          value: { bio: 'Updated bio', country: 'Canada' },
        },
        example2: {
          summary: 'Update phone number',
          value: { phoneNumber: '9876543210' },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Profile updated successfully.',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request. Validation failed.',
    }),
  ),

  UpdateAvatar: () => applyDecorators(
    ApiOperation({ summary: 'Update the current user\'s avatar' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: `Avatar image file. Must be a valid image format (e.g., JPEG, PNG) and not exceed ${MAX_AVATAR_SIZE}MB in size.`,
      schema: {
        type: 'object',
        properties: {
          avatar: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Avatar updated successfully.',
      example: {
        message: 'Avatar updated successfully',
        avatar: 'avatar-12345.jpg',
      },
    }),
    ApiResponse({
      status: 400,
      description: `Bad request. Invalid file format or file size exceeds limit of ${MAX_AVATAR_SIZE}MB.`,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found.',
    }),
  ),

  Delete: () => applyDecorators(
    ApiOperation({ summary: 'Delete the current user\'s account' }),
    ApiResponse({
      status: 200,
      description: 'User account deleted successfully. JWT cookie is cleared.',
      headers: {
        'Set-Cookie': {
          description: 'Clears the JWT cookie.',
          schema: { type: 'string', example: 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' },
        },
      },
    }),
  )

}