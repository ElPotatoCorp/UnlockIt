import { ApiProperty } from '@nestjs/swagger';
import { ExactData, GameTag } from '@unlockit/shared';
import { TagEntity } from '../entities/tag.entity';
import { TagEntityDoc } from 'src/docs/tags/entities/tag.entity.doc';

export class GameTagDto implements GameTag {
  @TagEntityDoc.Id()
  id: number;

  @TagEntityDoc.Name()
  name: string;

  static fromEntity(tag: TagEntity): GameTagDto {
    const dto = new GameTagDto();

    dto.id = tag.id;
    dto.name = tag.name;

    return dto;
  }
}

const _assertExact: ExactData<GameTag, GameTagDto> = true;
