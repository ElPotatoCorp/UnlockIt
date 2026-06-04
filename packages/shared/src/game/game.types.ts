import { DeveloperEntity } from "../developer/developer.types";
import { GamePlatformEntity } from "../game-platform/game-platform.types";
import { MediaEntity } from "../media/media.types";
import { PublisherEntity } from "../publisher/publisher.types";
import { Series } from "../series/series.types";
import { TagEntity } from "../tag/tag.types";
import { NullToOptional } from "../utils/types";
import { EUAgeRating, GameType, LangCode } from "./game.enums";

export type Game = {
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

  // =====================================================
  // Relations
  // =====================================================

  series: Promise<Series | null>;
  tags: Promise<TagEntity[]>;
  developers: Promise<DeveloperEntity[]>;
  publishers: Promise<PublisherEntity[]>;
  platforms: Promise<GamePlatformEntity | null>;
  media: Promise<MediaEntity[]>;
};

export type CreateGame = NullToOptional<Omit<Game, 'id' | 'series' | 'tags' | 'developers' | 'publishers' | 'platforms' | 'media'>>;

export type UpdateGame = Partial<CreateGame>;

export type SummaryGame = Pick<Game, 'id' | 'name' | 'slug' | 'type' | 'price' | 'ageRating' | 'comingSoon' | 'headerImage' | 'shortDescription'>;