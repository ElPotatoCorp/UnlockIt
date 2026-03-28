import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const ApiAuth = () => applyDecorators(
  ApiCookieAuth('jwt'),
  ApiBearerAuth(),
  ApiUnauthorizedResponse({ description: 'Unauthorized. No valid JWT cookie or Bearer token.' }),
);