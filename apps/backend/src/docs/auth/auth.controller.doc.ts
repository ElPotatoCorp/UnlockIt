import { applyDecorators } from '@nestjs/common';
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
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiAuth } from './decorators/api-auth.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import {
  JWT_ACCESS_TOKEN_COOKIE_NAME,
  JWT_REFRESH_TOKEN_COOKIE_NAME,
} from 'src/globals';
import {
  DuplicatedEntryExceptionSchemaDoc,
  DuplicatedEntryException,
} from 'src/common/dto/duplicated-entry.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { CreatePasswordResetDto } from 'src/auth/dto/create-password-reset.dto';
import { LoginDto } from 'src/auth/dto/login.dto';

export const AuthControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Auth')),

  Me: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({ summary: 'Get the currently authenticated user' }),
      ApiOkResponse({
        description:
          'Returns the current authenticated user. By that, it means to return the content of the JWT token.',
        type: JwtPayloadDto,
        schema: {
          example: {
            sub: 'a3f1c2d4-b5e7-4f9c-8d3a-1e2f3b4c5d6e',
            sid: 'session-12345',
            iat: 1609459200,
            exp: 1609545600,
          },
        },
      }),
    ),

  Register: () =>
    applyDecorators(
      ApiExtraModels(DuplicatedEntryException),
      ApiOperation({ summary: 'Register a new user' }),
      ApiBody({
        description: 'User registration payload',
        type: CreateUserDto,
        examples: {
          example1: {
            summary: 'Standard registration',
            value: {
              username: 'johndoe',
              email: 'john.doe@example.com',
              password: 'Str0ng!Pass',
            },
          },
        },
      }),
      ApiCreatedResponse({
        description: 'User registered successfully.',
        type: UserDto,
      }),
      ApiBadRequestResponse({ description: 'Bad request. Validation failed.' }),
      ApiConflictResponse({
        description: 'Conflict. Email or username already taken.',
        schema: DuplicatedEntryExceptionSchemaDoc(CreateUserDto, [
          'email',
          'username',
        ]),
      }),
      ApiTooManyRequestsResponse({
        description: 'Too many login attempts. Please try again later.',
      }),
    ),

  Login: () =>
    applyDecorators(
      ApiOperation({
        summary:
          'Login with credentials. It accepts either username or email as the identifier.',
        description:
          'Authenticates the user and sets an **httpOnly JWT cookie** (`jwt`) valid for 1 day. All subsequent requests to protected routes must include this cookie.',
      }),
      ApiBody({
        type: LoginDto,
        examples: {
          usernameExample: {
            summary: 'Login with username',
            value: { identifier: 'johndoe', password: 'Str0ng!Pass' },
          },
          emailExample: {
            summary: 'Login with email',
            value: {
              identifier: 'john.doe@example.com',
              password: 'Str0ng!Pass',
            },
          },
        },
        description:
          'Provide either `username` or `email` as the `identifier` along with the `password` to authenticate.',
        schema: {
          type: 'object',
          properties: {
            identifier: { type: 'string', example: 'johndoe' },
            password: {
              type: 'string',
              format: 'password',
              example: 'Str0ng!Pass',
            },
          },
          required: ['password'],
        },
      }),
      ApiOkResponse({
        description: `Login successful. The \`${JWT_ACCESS_TOKEN_COOKIE_NAME}\` and \`${JWT_REFRESH_TOKEN_COOKIE_NAME}\` httpOnly cookies are set.`,
        headers: {
          'Set-Cookie': {
            description:
              'httpOnly JWT cookie. Automatically sent on subsequent requests.',
            schema: {
              type: 'string',
              example: `${JWT_ACCESS_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=900000, ${JWT_REFRESH_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000000`,
            },
          },
        },
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid credentials.',
      }),
      ApiTooManyRequestsResponse({
        description: 'Too many login attempts. Please try again later.',
      }),
    ),

    // POST /auth/forgotten-password
  ForgottenPassword: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Request a password reset',
        description:
          'Creates a password reset ticket for the given identifier (username or email).\n\n' +
          '**Dev-only behavior:** there is no mailing system yet, so the ticket ID is returned directly in the response body instead of being emailed. This must not ship to production as-is — the ticket ID should only ever reach the user via a sent email.',
      }),
      ApiBody({
        type: CreatePasswordResetDto,
        examples: {
          withUsername: {
            summary: 'With Username',
            value: { identifier: 'johndoe' },
          },
          withEmail: {
            summary: 'With Email',
            value: { identifier: 'john.doe@example.com' },
          },
        },
      }),
      ApiCreatedResponse({
        description: 'Password reset ticket created.',
        schema: {
          example: { resetToken: '7c9e6679-7425-40de-944b-e07fc1f90ae7' },
        },
      }),
      ApiNotFoundResponse({ description: 'No user with this identifier.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
      ApiTooManyRequestsResponse({
        description: 'Too many password reset requests. Please try again later.',
      }),
    ),

  // POST /auth/reset-password/:ticketId
  ResetPassword: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Reset password using a ticket',
        description:
          'Sets a new password using the ticket ID returned by POST /auth/forgotten-password. The ticket is single-use.',
      }),
      ApiParam({
        name: 'resetToken',
        type: String,
        format: 'uuid',
        description: 'UUID of the password reset ticket.',
        example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      }),
      ApiBody({ type: ResetPasswordDto }),
      ApiOkResponse({ description: 'Password updated successfully.' }),
      ApiNotFoundResponse({
        description: 'No ticket found with the specified ID.',
      }),
      ApiBadRequestResponse({
        description: 'Validation failed (weak or too short password).',
      }),
      ApiUnprocessableEntityResponse({
        description: 'The user the request was made for does not exist anymore.'
      }),
      ApiTooManyRequestsResponse({
        description: 'Too many attempts. Please try again later.',
      }),
    ),

  Refresh: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Refresh the access token using the refresh token',
        description: `Requires a valid \`${JWT_REFRESH_TOKEN_COOKIE_NAME}\` httpOnly cookie. If valid, it issues a new access token and refresh token, updating the cookies accordingly.`,
      }),
      ApiCreatedResponse({
        description: `Token refreshed successfully. The \`${JWT_ACCESS_TOKEN_COOKIE_NAME}\` and \`${JWT_REFRESH_TOKEN_COOKIE_NAME}\` httpOnly cookies are updated with new tokens.`,
        headers: {
          'Set-Cookie': {
            description: 'Updated httpOnly JWT cookies.',
            schema: {
              type: 'string',
              example: `${JWT_ACCESS_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=900000, ${JWT_REFRESH_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000000`,
            },
          },
        },
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid or expired refresh token.',
      }),
    ),

  Logout: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Logout the current user',
        description: `Clears the \`${JWT_ACCESS_TOKEN_COOKIE_NAME}\` and \`${JWT_REFRESH_TOKEN_COOKIE_NAME}\` cookies, effectively ending the session.`,
      }),
      ApiNoContentResponse({
        description: `Logged out. The \`${JWT_ACCESS_TOKEN_COOKIE_NAME}\` and \`${JWT_REFRESH_TOKEN_COOKIE_NAME}\` cookies have been cleared.`,
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
