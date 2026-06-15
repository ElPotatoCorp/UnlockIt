import { ExactData, GameTag } from '@unlockit/shared';
import { TagEntityDoc } from 'src/docs/tags/entities/tag.entity.doc';

export class GameTagDto implements GameTag {
  @TagEntityDoc.Id()
  id: number;

  @TagEntityDoc.Name()
  name: string;
}

const _assertExact: ExactData<GameTag, GameTagDto> = true;
