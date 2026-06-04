import { Game } from "../game/game.types";

export type PublisherEntity = {
  id: number;
  name: string;
  gamesCount: number;
  games: Promise<Game[]>;
};

export type Publisher = Pick<PublisherEntity, 'id' | 'name'>;

export type CreatePublisher = Omit<Publisher, 'id'>;

export type UpdatePublisher = Partial<CreatePublisher>;