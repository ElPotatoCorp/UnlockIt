import { GameEntity, SummaryGame } from "../game/game.types";
import { Simplify } from "../utils/types";

export type PublisherEntity = {
  id: number;
  name: string;
  gamesCount: number;
  games: GameEntity[];
};

export type Publisher = Simplify<Omit<PublisherEntity, 'games'> & { games: SummaryGame[] }>;

export type GamePublisher = Pick<Publisher, 'id' | 'name'>;

export type CreatePublisher = Pick<Publisher, 'name'>;

export type UpdatePublisher = Partial<CreatePublisher>;