import { DeveloperEntity } from "@unlockit/shared";

export class GameDeveloperDto implements GameDeveloperDto {
  id: number;
  name: string;

  static fromEntity(developer: DeveloperEntity): GameDeveloperDto {
    const dto = new GameDeveloperDto();

    dto.id = developer.id;
    dto.name = developer.name;

    return dto;
  }
}