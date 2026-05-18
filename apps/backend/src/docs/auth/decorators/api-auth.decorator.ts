import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JWT_ACCESS_TOKEN_COOKIE_NAME, JWT_REFRESH_TOKEN_COOKIE_NAME } from "src/globals";

export const ApiAuth = () => applyDecorators(
  ApiCookieAuth(JWT_ACCESS_TOKEN_COOKIE_NAME),
  ApiCookieAuth(JWT_REFRESH_TOKEN_COOKIE_NAME),
  ApiUnauthorizedResponse({ description: 'Unauthorized. No valid JWT cookie.' }),
);