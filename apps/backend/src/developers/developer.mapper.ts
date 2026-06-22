import { GameDeveloperDto } from './dto/game-developer.dto';
import { DeveloperEntity } from './entities/developer.entity';

export class DeveloperMapper {
  static toGameDeveloper(developer: DeveloperEntity) {
    const dto = new GameDeveloperDto();

    dto.id = developer.id;
    dto.name = developer.name;

    return dto;
  }
}
