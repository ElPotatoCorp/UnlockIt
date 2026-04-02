import { join } from "path";

export const ENV_FILE_PATH = join(__dirname, '..', '..', '..', `.env.${process.env.NODE_ENV || 'development'}`);

export const JWT_ACCESS_TOKEN_COOKIE_NAME='unlockit-dev-access-token';
export const JWT_REFRESH_TOKEN_COOKIE_NAME='unlockit-dev-refresh-token';

export const ROOT_DIR = join(__dirname, '..');
export const UPLOADS_DIR = join(ROOT_DIR, 'uploads');
export const AVATARS_DIR = join(UPLOADS_DIR, 'avatars');