import { GameEntity, SummaryGame } from "../game/game.types";
import { Simplify } from "../utils/types";

export type SeriesEntity = {
  id: number;
  name: string;
  slug: string;
  games: GameEntity[];
}

export type Series = Simplify<Omit<SeriesEntity, 'games'> & {
  games: SummaryGame[];
}>;

export type CreateSeries = Simplify<Omit<SeriesEntity, 'id' | 'games'> & {
  gameIds?: number[];
}>

export type UpdateSeries = Partial<Omit<CreateSeries, 'gameIds'>>;

export type ModifyGamesInSeries = Pick<CreateSeries, 'gameIds'>;