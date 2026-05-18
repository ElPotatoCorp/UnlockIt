import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { join } from 'path';
import { UPLOADS_DIR } from 'src/globals';
import { UploadSubdir } from './upload.constants';

@Injectable()
export class UploadService {
  removeObsoleteFile(subdir: UploadSubdir, file: string | null) {
    if (!file) {
      return;
    }

    const fullPath = join(UPLOADS_DIR, subdir, file);

    unlink(fullPath, (err) => {
      if (err) {
        console.error('Failed to delete obsolete file:', err);
      }
    });
  }
}
