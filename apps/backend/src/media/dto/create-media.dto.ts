import { CreateMedia, MediaType } from '@unlockit/shared';
import { IsEnum, IsUrl } from 'class-validator';
import { MediaEntityDoc } from 'src/docs/media/entities/media.entity.doc';

export class CreateMediaDto implements CreateMedia {
  @MediaEntityDoc.Url()
  @IsUrl()
  url: string;

  @MediaEntityDoc.Type()
  @IsEnum(MediaType)
  type: MediaType;
}
