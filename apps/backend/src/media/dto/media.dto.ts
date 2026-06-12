import { ExactData, Media, MediaType } from '@unlockit/shared';
import { MediaEntity } from '../entities/media.entity';
import { MediaEntityDoc } from 'src/docs/media/entities/media.entity.doc';

export class MediaDto implements Media {
  @MediaEntityDoc.Id()
  id: number;

  @MediaEntityDoc.Url()
  url: string;

  @MediaEntityDoc.Type()
  type: MediaType;

  static fromEntity(media: MediaEntity): MediaDto {
    const dto = new MediaDto();

    dto.id = media.id;
    dto.url = media.url;
    dto.type = media.type;

    return dto;
  }
}

const _assertExact: ExactData<Media, MediaDto> = true;
