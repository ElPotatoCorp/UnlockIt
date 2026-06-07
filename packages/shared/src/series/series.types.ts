import { Game, SummaryGame } from "../game/game.types";

export type Series = {
  id: number;
  name: string;
  slug: string;
  games: Promise<Game[]>;
}

export type SummarySeries = {
  name: string;
  slug: string;
  games: SummaryGame[];
}