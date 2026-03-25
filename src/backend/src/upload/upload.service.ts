import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { join } from 'path';
import { AVATARS_DIR } from 'src/globals';

@Injectable()
export class UploadService {
  removeObsoleteFile(file: string | null) {
    if (!file) {
      return;
    }

    const fullPath = join(AVATARS_DIR, file);

    unlink(fullPath, (err) => {
      if (err) {
        console.error('Failed to delete obsolete file:', err);
      }
    });
  }
}
