import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiAuth } from "./decorators/api-auth.decorator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export const AuthControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Auth')),

  Me: () => applyDecorators(
    ApiOperation({ summary: 'Get the currently authenticated user' }),
    ApiResponse({
      status: 200,
      description: 'Returns the current authenticated user. By that, it means to return the content of the JWT token.',
      schema: {
        example: {
          id: 'a3f1c2d4-...',
          username: 'johndoe',
          // email: 'john@example.com', // Maybe later, but for now we keep it private
        },
      },
    }),
    ApiAuth()
  ),

  Register: () => applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({
      description: 'User registration payload',
      type: CreateUserDto,
      examples: {
        example1: {
          summary: 'Standard registration',
          value: { username: 'johndoe', email: 'john.doe@example.com', password: 'strongpassword' },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully.',
      schema: {
        example: { id: 'a3f1c2d4-...', username: 'johndoe', email: 'john.doe@example.com' },
      },
    }),
    ApiResponse({ status: 400, description: 'Bad request. Validation failed.' }),
    ApiResponse({ status: 409, description: 'Conflict. Email or username already taken.' })
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
          value: { identifier: 'johndoe', password: 'strongpassword' },
        },
        emailExample: {
          summary: 'Login with email',
          value: { identifier: 'john.doe@example.com', password: 'strongpassword' },
        },
      },
      description: 'Provide either `username` or `email` as the `identifier` along with the `password` to authenticate.',
      schema: {
        type: 'object',
        properties: {
          identifier: { type: 'string', example: 'johndoe' },
          password: { type: 'string', format: 'password', example: 'strongpassword' }
        },
        required: ['password']
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Login successful. A `jwt` httpOnly cookie is set.',
      headers: {
        'Set-Cookie': {
          description: 'httpOnly JWT cookie. Automatically sent on subsequent requests.',
          schema: { type: 'string', example: 'jwt=eyJhbG...; Path=/; HttpOnly; SameSite=Strict' },
        },
      },
      schema: {
        example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized. Invalid credentials.' })
  ),

  Logout: () => applyDecorators(
    ApiOperation({
      summary: 'Logout the current user',
      description: 'Clears the `jwt` cookie, effectively ending the session.',
    }),
    ApiResponse({
      status: 204,
      description: 'Logged out. The `jwt` cookie has been cleared.',
      headers: {
        'Set-Cookie': {
          description: 'Clears the JWT cookie.',
          schema: { type: 'string', example: 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' },
        },
      },
    })
  )
}