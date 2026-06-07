import { Media, MediaType } from '@unlockit/shared';
import { MediaEntity } from '../entities/media.entity';

export class MediaDto implements Media {
  id: number;
  url: string;
  type: MediaType;

  static fromEntity(media: MediaEntity): MediaDto {
    const dto = new MediaDto();

    dto.id = media.id;
    dto.url = media.url;
    dto.type = media.type;

    return dto;
  }
}
