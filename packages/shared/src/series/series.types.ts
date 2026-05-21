import { Game } from "../game/game.types";

export class Series {
  id: number;
  name: string;
  slug: string;
  games: Promise<Game[]>;
}