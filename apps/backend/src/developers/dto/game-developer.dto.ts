import { ExactData, GameDeveloper } from '@unlockit/shared';
import { DeveloperEntity } from '../entities/developer.entity';

export class GameDeveloperDto implements GameDeveloper {
  id: number;
  name: string;

  static fromEntity(developer: DeveloperEntity): GameDeveloperDto {
    const dto = new GameDeveloperDto();

    dto.id = developer.id;
    dto.name = developer.name;

    return dto;
  }
}

const _assertExact: ExactData<GameDeveloper, GameDeveloperDto> = true;
