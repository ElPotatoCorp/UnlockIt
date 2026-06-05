import { join } from 'path';

const ENV_FILES_DIR = join(
  __dirname,
  '..',
  '..',
  '..',
  '..'
);

export const ENV_FILES_PATHS = [
  join(ENV_FILES_DIR, `.env.${process.env.NODE_ENV || 'development'}.local`),
  join(ENV_FILES_DIR, `.env.${process.env.NODE_ENV || 'development'}`),
]

export const JWT_ACCESS_TOKEN_COOKIE_NAME = 'unlockit-access-token';
export const JWT_REFRESH_TOKEN_COOKIE_NAME = 'unlockit-refresh-token';

export const ROOT_DIR = join(__dirname, '..', '..');
export const UPLOADS_DIR = join(ROOT_DIR, 'uploads');
