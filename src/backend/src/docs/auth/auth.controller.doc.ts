import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ApiAuth } from "./decorators/api-auth.decorator";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { JwtPayloadDto } from "src/auth/dto/jwt-payload.dto";
import { JWT_ACCESS_TOKEN_COOKIE_NAME, JWT_REFRESH_TOKEN_COOKIE_NAME } from "src/globals";

export const AuthControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Auth')),

  Me: () => applyDecorators(
    ApiAuth(),
    ApiOperation({ summary: 'Get the currently authenticated user' }),
    ApiOkResponse({
      description: 'Returns the current authenticated user. By that, it means to return the content of the JWT token.',
      type: JwtPayloadDto,
      schema: {
        example: {
          sub: 'a3f1c2d4-b5e7-4f9c-8d3a-1e2f3b4c5d6e',
          sid: 'session-12345',
          iat: 1609459200,
          exp: 1609545600
        },
      },
    })
  ),

  Register: () => applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({
      description: 'User registration payload',
      type: CreateUserDto,
      examples: {
        example1: {
          summary: 'Standard registration',
          value: { username: 'johndoe', email: 'john.doe@example.com', password: 'Str0ng!Pass' },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'User registered successfully.',
      schema: {
        example: { id: 'a3f1c2d4-...', username: 'johndoe', email: 'john.doe@example.com' },
      },
    }),
    ApiBadRequestResponse({ description: 'Bad request. Validation failed.' }),
    ApiConflictResponse({ description: 'Conflict. Email or username already taken.' })
  ),

  Login: () => applyDecorators(
    ApiOperation({
      summary: 'Login with credentials. It accepts either username or email as the identifier.',
      description: 'Authenticates the user and sets an **httpOnly JWT cookie** (`jwt`) valid for 1 day. All subsequent requests to protected routes must include this cookie.',
    }),
    ApiBody({
      examples: {
        usernameExample: {
          summary: 'Login with username',
          value: { identifier: 'johndoe', password: 'Str0ng!Pass' },
        },
        emailExample: {
          summary: 'Login with email',
          value: { identifier: 'john.doe@example.com', password: 'Str0ng!Pass' },
        },
      },
      description: 'Provide either `username` or `email` as the `identifier` along with the `password` to authenticate.',
      schema: {
        type: 'object',
        properties: {
          identifier: { type: 'string', example: 'johndoe' },
          password: { type: 'string', format: 'password', example: 'Str0ng!Pass' }
        },
        required: ['password']
      }
    }),
    ApiCreatedResponse({
      description: `Login successful. The \`${JWT_ACCESS_TOKEN_COOKIE_NAME}\` and \`${JWT_REFRESH_TOKEN_COOKIE_NAME}\` httpOnly cookies are set.`,
      headers: {
        'Set-Cookie': {
          description: 'httpOnly JWT cookie. Automatically sent on subsequent requests.',
          schema: {
            type: 'string',
            example: `${JWT_ACCESS_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=900000, ${JWT_REFRESH_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000000`
          }
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized. Invalid credentials.' })
  ),

  Refresh: () => applyDecorators(
    ApiAuth(),
    ApiOperation({
      summary: 'Refresh the access token using the refresh token',
      description: `Requires a valid \`${JWT_REFRESH_TOKEN_COOKIE_NAME}\` httpOnly cookie. If valid, it issues a new access token and refresh token, updating the cookies accordingly.`,
    }),
    ApiNoContentResponse({
      description: `Token refreshed successfully. The \`${JWT_ACCESS_TOKEN_COOKIE_NAME}\` and \`${JWT_REFRESH_TOKEN_COOKIE_NAME}\` httpOnly cookies are updated with new tokens.`,
      headers: {
        'Set-Cookie': {
          description: 'Updated httpOnly JWT cookies.',
          schema: {
            type: 'string',
            example: `${JWT_ACCESS_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=900000, ${JWT_REFRESH_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000000`
          }
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized. Invalid or expired refresh token.' })
  ),

  Logout: () => applyDecorators(
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
            example: `${JWT_ACCESS_TOKEN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0, ${JWT_REFRESH_TOKEN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
          },
        },
      },
    })
  )
}