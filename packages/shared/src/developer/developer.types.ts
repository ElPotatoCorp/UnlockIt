import { Game } from "../game/game.types";

export type DeveloperEntity = {
  id: number;

  name: string;

  gamesCount: number;

  games: Promise<Game[]>;
};

export type Developer = Pick<DeveloperEntity, 'id' | 'name'>;

export type CreateDeveloper = Omit<Developer, 'id'>;

export type UpdateDeveloper = Partial<CreateDeveloper>;