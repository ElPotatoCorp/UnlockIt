import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiResponse } from "@nestjs/swagger";

export const ApiAuth = () => applyDecorators(
  ApiCookieAuth('jwt'),
  ApiBearerAuth(),
  ApiResponse({ status: 401, description: 'Unauthorized. No valid JWT cookie or Bearer token.' }),
);