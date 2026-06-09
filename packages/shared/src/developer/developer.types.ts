import { GameEntity, SummaryGame } from "../game/game.types";
import { Simplify } from "../utils/types";

export type DeveloperEntity = {
  id: number;
  name: string;
  gamesCount: number;
  games: Promise<GameEntity[]>;
};

export type Developer = Simplify<Omit<DeveloperEntity, 'games'> & { games: SummaryGame[] }>;

export type GameDeveloper = Pick<Developer, 'id' | 'name'>;

export type CreateDeveloper = Pick<Developer, 'name'>;

export type UpdateDeveloper = Partial<CreateDeveloper>;