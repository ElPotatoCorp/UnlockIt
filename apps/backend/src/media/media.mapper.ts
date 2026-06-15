import { MediaDto } from "./dto/media.dto";
import { MediaEntity } from "./entities/media.entity";

export class MediaMapper {
  static toMedia(media: MediaEntity) {
    const dto = new MediaDto();

    dto.id = media.id;
    dto.url = media.url;
    dto.type = media.type;

    return dto;
  }
}