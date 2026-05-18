import { registerAs } from '@nestjs/config';
import { JWT_ACCESS_TOKEN_COOKIE_NAME, JWT_REFRESH_TOKEN_COOKIE_NAME } from 'src/globals';

export default registerAs('jwtConfig', () => ({
  accessTokenExpiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '') || 1000 * 60 * 15,
  refreshTokenExpiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '') || 1000 * 60 * 60 * 24 * 30,
  accessTokenCookieName: JWT_ACCESS_TOKEN_COOKIE_NAME,
  refreshTokenCookieName: JWT_REFRESH_TOKEN_COOKIE_NAME,
  secret: process.env.JWT_SECRET || 'THIS SHOULD NOT BE THE SECRET',
}));