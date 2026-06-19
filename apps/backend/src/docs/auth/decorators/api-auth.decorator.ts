import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { EmployeeRole } from '@unlockit/shared';
import {
  JWT_ACCESS_TOKEN_COOKIE_NAME,
  JWT_REFRESH_TOKEN_COOKIE_NAME,
} from 'src/globals';

export const ApiAuth = (role?: EmployeeRole) =>
  applyDecorators(
    ApiCookieAuth(JWT_ACCESS_TOKEN_COOKIE_NAME),
    ApiCookieAuth(JWT_REFRESH_TOKEN_COOKIE_NAME),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. No valid JWT cookie.',
    }),
    ...(role
      ? [
          ApiForbiddenResponse({
            description: `Forbidden. Requires at least the ${role} role.`,
          }),
        ]
      : []),
  );
