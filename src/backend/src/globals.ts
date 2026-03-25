import { join } from "path";

export const ENV_FILE_PATH = join(__dirname, '..', '..', '..', `.env.${process.env.NODE_ENV || 'development'}`);

export const ROOT_DIR = join(__dirname, '/..');
export const UPLOADS_DIR = join(ROOT_DIR, 'uploads');
export const AVATARS_DIR = join(UPLOADS_DIR, 'avatars');