import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { MAX_AVATAR_SIZE } from 'src/upload/upload.constants';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UpdateBillingDto } from 'src/user/dto/update-billing.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { UpdateProfileDto } from 'src/user/dto/update-profile.dto';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';
import { UserBillingDto } from 'src/user/dto/user-billing.dto';
import {
  JWT_ACCESS_TOKEN_COOKIE_NAME,
  JWT_REFRESH_TOKEN_COOKIE_NAME,
} from 'src/globals';

export const UserControllerDoc = {
  Controller: () => applyDecorators(ApiTags('User'), ApiAuth()),

  Index: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get own profile' }),
      ApiOkResponse({
        description:
          'Core user fields. Email is partially masked. Profile and billing are not included — use their respective endpoints.',
        type: UserDto,
        example: {
          id: 'a3f1c2d4-b5e7-4f9c-8d3a-1e2f3b4c5d6e',
          username: 'johndoe',
          email: 'jo***@example.com',
          phoneNumber: '+33612345678',
          bio: 'I love gaming.',
          avatar: 'avatar-3f2a1c.jpg',
          wallet: 49.99,
          createdAt: '2024-01-15T10:23:00Z',
        },
      }),
      ApiNotFoundResponse({ description: 'User not found.' }),
    ),

  GetProfile: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get own profile details' }),
      ApiOkResponse({
        description:
          'Returns the UserProfile row. Null fields mean the user has not filled them in yet.',
        type: UserProfileDto,
        example: {
          firstName: 'John',
          lastName: 'Doe',
          birthdate: '1990-05-15',
          country: 'FR',
          newsletter: false,
        },
      }),
      ApiNotFoundResponse({
        description: 'Profile not found (not yet created).',
      }),
    ),

  GetBilling: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get own billing address' }),
      ApiOkResponse({
        description: 'Returns the UserBilling row if it exists.',
        type: UserBillingDto,
        example: {
          firstName: 'John',
          lastName: 'Doe',
          country: 'FR',
          city: 'Paris',
          postalCode: '75001',
          addressLine1: '12 Rue de Rivoli',
          addressLine2: null,
        },
      }),
      ApiNotFoundResponse({ description: 'No billing address on file.' }),
    ),

  Patch: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update own profile',
        description:
          'Updates core user fields and/or profile fields. All fields are optional. Billing info is managed separately via PUT /user/billing.',
      }),
      ApiBody({ type: UpdateUserDto }),
      ApiOkResponse({ description: 'Profile updated successfully.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  UpsertProfile: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create or replace profile details',
        description:
          'Full upsert — all fields required. Replaces the existing profile row if one exists.',
      }),
      ApiBody({ type: UpdateProfileDto }),
      ApiOkResponse({ description: 'Profile saved.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  UpsertBilling: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create or replace billing address',
        description:
          'Full upsert — all fields required. Replaces the existing billing row if one exists.',
      }),
      ApiBody({ type: UpdateBillingDto }),
      ApiOkResponse({ description: 'Billing address saved.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  UpdateAvatar: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update own avatar' }),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        description: `JPEG, PNG, GIF, or WebP. Max ${MAX_AVATAR_SIZE}MB. Replaces any existing avatar.`,
        schema: {
          type: 'object',
          properties: {
            avatar: { type: 'string', format: 'binary' },
          },
        },
      }),
      ApiOkResponse({
        description: 'Avatar updated. Returns the new filename.',
        example: { avatar: 'avatar-3f2a1c.jpg' },
      }),
      ApiBadRequestResponse({
        description: 'Invalid file type or size exceeded.',
      }),
      ApiNotFoundResponse({ description: 'User not found.' }),
    ),

  DeleteAvatar: () =>
    applyDecorators(
      ApiOperation({ summary: 'Remove own avatar' }),
      ApiOkResponse({
        description: 'Avatar removed. The avatar field is set to null.',
      }),
      ApiNotFoundResponse({ description: 'User not found.' }),
    ),

  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete own account',
        description:
          'Permanently deletes the account and all associated data. Clears auth cookies.',
      }),
      ApiOkResponse({
        description: 'Account deleted. Auth cookies cleared.',
        headers: {
          'Set-Cookie': {
            description: 'Clears the JWT cookies.',
            schema: {
              type: 'string',
              example: `${JWT_ACCESS_TOKEN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0, ${JWT_REFRESH_TOKEN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
            },
          },
        },
      }),
    ),
};
