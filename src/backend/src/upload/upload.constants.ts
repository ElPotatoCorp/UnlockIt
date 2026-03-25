import { UnprocessableEntityException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const uploadUserAvatar = {
  multerOptions: {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req: any, file: Express.Multer.File, cb: (err: Error | null, filename: string) => void) => {
        const userId = req?.user?.id;
        const ext = '.' + (file.mimetype.split('/').pop() || 'bin');
        const filename = `avatar-${userId}-${Date.now()}${ext}`;
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
      // Validate MIME type
      if (!/^image\/(jpeg|png|gif)$/.test(file.mimetype)) {
        return cb(new UnprocessableEntityException('Only JPEG, PNG, and GIF images are allowed'), false);
      }
      cb(null, true);
    },
  },
} as const;