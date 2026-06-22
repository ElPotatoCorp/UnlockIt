import { registerAs } from '@nestjs/config';

export default registerAs('coreConfig', () => ({
  env: process.env.NODE_ENV,
  https: process.env.HTTPS === 'true' ? true : false,
}));
