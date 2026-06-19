import { GameEntity, SummaryGame } from "../game/game.types";
import { Simplify } from "../utils/types";

export type TagEntity = {
  id: number;
  name: string;
  gamesCount: number;
  games: GameEntity[];
};

export type Tag = Omit<TagEntity, 'games'>;

export type GameTag = Pick<TagEntity, 'id' | 'name'>;

export type CreateTag = Pick<TagEntity, 'name'>;

export type UpdateTag = Partial<CreateTag>;