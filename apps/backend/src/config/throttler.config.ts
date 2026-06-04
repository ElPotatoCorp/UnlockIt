import { registerAs } from '@nestjs/config';

export default registerAs('throttlerConfig', () => ({
  authRegister: {
    ttl: parseInt(process.env.REGISTER_ATTEMPTS_WINDOW || '') || 30000, // 30 seconds in milliseconds
    limit: parseInt(process.env.REGISTER_ATTEMPTS_LIMIT || '') || 3,
  },
  authLogin: {
    ttl: parseInt(process.env.LOGIN_ATTEMPTS_WINDOW || '') || 30000, // 30 seconds in milliseconds
    limit: parseInt(process.env.LOGIN_ATTEMPTS_LIMIT || '') || 5,
  },
}));
