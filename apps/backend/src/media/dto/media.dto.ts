import { ExactData, Media, MediaType } from '@unlockit/shared';
import { MediaEntityDoc } from 'src/docs/media/entities/media.entity.doc';

export class MediaDto implements Media {
  @MediaEntityDoc.Id()
  id: number;

  @MediaEntityDoc.Url()
  url: string;

  @MediaEntityDoc.Type()
  type: MediaType;
}

const _assertExact: ExactData<Media, MediaDto> = true;
