import { GameEntity } from "../game/game.types";

export type TagEntity = {
  id: number;
  name: string;
  gamesCount: number;
  games: Promise<GameEntity[]>;
};

export type Tag = Pick<TagEntity, 'id' | 'name'>;

export type CreateTag = Omit<Tag, 'id'>;

export type UpdateTag = Partial<CreateTag>;