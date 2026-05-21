import { Series } from "../series/series.types";
import { NullToOptional } from "../utils/types";
import { EUAgeRating, GameType, LangCode } from "./game.enums";

export class Game {
  id: number;
  name: string;
  slug: string;
  type: GameType;
  price: number;
  ageRating: EUAgeRating;
  releaseDate: string | null;
  comingSoon: boolean;
  headerImage: string;
  coverImage: string;
  backgroundImage: string;
  shortDescription: string;
  detailedDescription: string;
  metacriticScore: number | null;
  website: string | null;
  pcRequirements: string | null;
  supportedLanguages: LangCode[] | null;
  series: Series | null;
}

export type CreateGame = NullToOptional<Omit<Game, 'id' | 'series'>>;

export type UpdateGame = Partial<CreateGame>;

export type SummaryGame = Pick<Game, 'id' | 'name' | 'slug' | 'type' | 'price' | 'ageRating' | 'comingSoon' | 'headerImage' | 'shortDescription'>;