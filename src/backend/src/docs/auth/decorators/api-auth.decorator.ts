import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const ApiAuth = () => applyDecorators(
  ApiCookieAuth('jwt'),
  ApiUnauthorizedResponse({ description: 'Unauthorized. No valid JWT cookie or Bearer token.' }),
);