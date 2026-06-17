import { DeveloperEntity, GameDeveloper } from "../developer/developer.types";
import { GamePlatform, GamePlatformEntity, PartialGamePlatform } from "../game-platform/game-platform.types";
import { Media, MediaEntity } from "../media/media.types";
import { GamePublisher, PublisherEntity } from "../publisher/publisher.types";
import { Review, ReviewEntity } from "../review/review.types";
import { Series, SeriesEntity } from "../series/series.types";
import { GameTag, TagEntity } from "../tag/tag.types";
import { NullToOptional, Simplify } from "../utils/types";
import { EUAgeRating, GameType, LangCode } from "./game.enums";

export type GameEntity = {
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
  supportedLanguages: LangCode[];

  // =====================================================
  // Relations
  // =====================================================

  series: SeriesEntity | null;
  tags: TagEntity[];
  developers: DeveloperEntity[];
  publishers: PublisherEntity[];
  platforms: GamePlatformEntity;
  media: MediaEntity[];
  reviews: ReviewEntity[];
};
type GameRelationKeys = 'series' | 'tags' | 'developers' | 'publishers' | 'platforms' | 'media' | 'reviews';

export type CreateGame = Simplify<NullToOptional<Omit<GameEntity, 'id' | 'supportedLanguages' | GameRelationKeys>> & {
  supportedLanguages?: LangCode[];
  platforms?: PartialGamePlatform;
}>;

export type UpdateGame = Partial<CreateGame>;

export type SummaryGame = Simplify<Pick<GameEntity, 'id' | 'name' | 'slug' | 'type' | 'price' | 'ageRating' | 'comingSoon' | 'headerImage' | 'shortDescription'> & { wishlisted?: boolean }>;

export type GameDetail = Simplify<Omit<GameEntity, GameRelationKeys> & {
  tags: GameTag[];
  developers: GameDeveloper[];
  publishers: GamePublisher[];
  platforms: GamePlatform;
  media: Media[];
  series?: Series;
  reviews: Review[];

  wishlisted?: boolean;
}>;

export type SearchGameOptions = {
  /** Will be turned into a slug */
  name: string;
  type?: GameType;

  price?: {
    /** 
     * Minimum: 0
     * @default 0
     **/
    min: number;
    max?: number;
  };

  release?: {
    when?: 'exact' | 'before' | 'after' | 'coming-soon';
    date?: Date;
  };

  order: {
    by: 'popular' | 'price';
    asc?: boolean;
  };

  tags?: number[];
  developers?: number[];
  publishers?: number[];
  platforms?: PartialGamePlatform;
}

export type SearchBody = Omit<SearchGameOptions, 'name'>;