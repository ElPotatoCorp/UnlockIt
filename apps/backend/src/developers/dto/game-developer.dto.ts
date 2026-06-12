import { ExactData, GameDeveloper } from '@unlockit/shared';
import { DeveloperEntity } from '../entities/developer.entity';
import { DeveloperEntityDoc } from 'src/docs/developers/entities/developer.entity.doc';

export class GameDeveloperDto implements GameDeveloper {
  @DeveloperEntityDoc.Id()
  id: number;

  @DeveloperEntityDoc.Name()
  name: string;

  static fromEntity(developer: DeveloperEntity): GameDeveloperDto {
    const dto = new GameDeveloperDto();

    dto.id = developer.id;
    dto.name = developer.name;

    return dto;
  }
}

const _assertExact: ExactData<GameDeveloper, GameDeveloperDto> = true;
