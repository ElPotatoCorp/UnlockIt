import { UnprocessableEntityException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UPLOADS_DIR } from 'src/globals';

export enum UploadSubdir {
  AVATARS = 'avatars',
}

export const MAX_AVATAR_SIZE = 5; // MB

export const uploadUserAvatar = {
  multerOptions: {
    storage: diskStorage({
      destination: join(UPLOADS_DIR, UploadSubdir.AVATARS),
      filename: (
        req: any,
        file: Express.Multer.File,
        cb: (err: Error | null, filename: string) => void,
      ) => {
        const ext = '.' + (file.mimetype.split('/').pop() || 'bin');
        const filename = `avatar-${randomUUID()}-${Date.now()}${ext}`;
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: MAX_AVATAR_SIZE * 1024 * 1024,
    },
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
      // Validate MIME type
      if (!/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) {
        return cb(
          new UnprocessableEntityException(
            'Only JPEG, PNG, GIF, and WebP images are allowed',
          ),
          false,
        );
      }
      cb(null, true);
    },
  },
} as const;
