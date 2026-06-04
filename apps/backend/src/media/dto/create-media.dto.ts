import { IsEnum, IsUrl } from 'class-validator';
import { MediaEntityDoc } from 'src/docs/media/entities/media.entity.doc';
import { MediaType } from '../entities/media.entity';

export class CreateMediaDto {
  @MediaEntityDoc.Url()
  @IsUrl()
  url: string;

  @MediaEntityDoc.Type()
  @IsEnum(MediaType)
  type: MediaType;
}