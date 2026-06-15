import { GameEntity, SummaryGame } from "../game/game.types";
import { Simplify } from "../utils/types";

export type TagEntity = {
  id: number;
  name: string;
  gamesCount: number;
  games: GameEntity[];
};

export type Tag = Simplify<Omit<TagEntity, 'games'> & { games: SummaryGame[] }>;

export type GameTag = Pick<Tag, 'id' | 'name'>;

export type CreateTag = Pick<Tag, 'name'>;

export type UpdateTag = Partial<CreateTag>;