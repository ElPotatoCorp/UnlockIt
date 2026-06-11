import { GameEntity, SummaryGame } from "../game/game.types";
import { OmitPromises, Simplify } from "../utils/types";

export type SeriesEntity = {
  id: number;
  name: string;
  slug: string;
  games: Promise<GameEntity[]>;
}

export type Series = Simplify<OmitPromises<SeriesEntity> & {
  games: SummaryGame[];
}>;

export type CreateSeries = Simplify<Omit<OmitPromises<SeriesEntity>, 'id'> & {
  gameIds?: number[];
}>

export type UpdateSeries = Partial<Omit<CreateSeries, 'gameIds'>>;

export type ModifyGamesInSeries = Pick<CreateSeries, 'gameIds'>;