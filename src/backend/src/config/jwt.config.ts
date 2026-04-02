import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  accessTokenExpiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '') || 1000 * 60 * 15,
  refreshTokenExpiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '') || 1000 * 60 * 60 * 24 * 30,
  accessTokenCookieName: process.env.JWT_ACCESS_TOKEN_COOKIE_NAME || 'unlock-it-access-token',
  refreshTokenCookieName: process.env.JWT_REFRESH_TOKEN_COOKIE_NAME || 'unlock-it-refresh-token',
  secret: process.env.JWT_SECRET || 'THIS SHOULD NOT BE THE SECRET',
}));