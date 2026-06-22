import { GameTagDto } from './dto/game-tag.dto';
import { TagDto } from './dto/tag.dto';
import { TagEntity } from './entities/tag.entity';

export class TagMapper {
  static toTag(tag: TagEntity): TagDto {
    const dto = new TagDto();

    dto.id = tag.id;
    dto.name = tag.name;
    dto.gamesCount = tag.gamesCount;

    return dto;
  }

  static toGameTag(tag: TagEntity): GameTagDto {
    const dto = new GameTagDto();

    dto.id = tag.id;
    dto.name = tag.name;

    return dto;
  }
}
