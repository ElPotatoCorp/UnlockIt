import { ExactData, GameTag, TagEntity } from '@unlockit/shared';

export class GameTagDto implements GameTag {
  id: number;
  name: string;

  static fromEntity(tag: TagEntity): GameTagDto {
    const dto = new GameTagDto();

    dto.id = tag.id;
    dto.name = tag.name;

    return dto;
  }
}

const _assertExact: ExactData<GameTag, GameTagDto> = true;
