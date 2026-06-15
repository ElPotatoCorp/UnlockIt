import { GameTagDto } from "./dto/game-tag.dto";
import { TagEntity } from "./entities/tag.entity";

export class TagMapper {
  static toGameTag(tag: TagEntity) {
    const dto = new GameTagDto();

    dto.id = tag.id;
    dto.name = tag.name;

    return dto;
  }
}