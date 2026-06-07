import { GameEntity, SummaryGame } from "../game/game.types";

export type SeriesEntity = {
  id: number;
  name: string;
  slug: string;
  games: Promise<GameEntity[]>;
}

export type SummarySeries = {
  name: string;
  slug: string;
  games: SummaryGame[];
}