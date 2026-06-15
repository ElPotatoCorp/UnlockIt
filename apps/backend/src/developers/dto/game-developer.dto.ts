import { ExactData, GameDeveloper } from '@unlockit/shared';
import { DeveloperEntityDoc } from 'src/docs/developers/entities/developer.entity.doc';

export class GameDeveloperDto implements GameDeveloper {
  @DeveloperEntityDoc.Id()
  id: number;

  @DeveloperEntityDoc.Name()
  name: string;
}

const _assertExact: ExactData<GameDeveloper, GameDeveloperDto> = true;
