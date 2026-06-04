import { Game } from "../game/game.types";

export type Series = {
  id: number;
  name: string;
  slug: string;
  games: Promise<Game[]>;
}