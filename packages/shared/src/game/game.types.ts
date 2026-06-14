import { DeveloperEntity, GameDeveloper } from "../developer/developer.types";
import { GamePlatform, GamePlatformEntity } from "../game-platform/game-platform.types";
import { Media, MediaEntity } from "../media/media.types";
import { GamePublisher, PublisherEntity } from "../publisher/publisher.types";
import { Series, SeriesEntity } from "../series/series.types";
import { StockEntity } from "../stock/stock.types";
import { GameTag, TagEntity } from "../tag/tag.types";
import { NullToOptional, OmitPromises, Simplify } from "../utils/types";
import { WishlistEntity } from "../wishlist/wishlist.types";
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
  supportedLanguages: LangCode[] | null;

  // =====================================================
  // Relations
  // =====================================================

  series: Promise<SeriesEntity | null>;
  tags: Promise<TagEntity[]>;
  developers: Promise<DeveloperEntity[]>;
  publishers: Promise<PublisherEntity[]>;
  platforms: Promise<GamePlatformEntity | null>;
  media: Promise<MediaEntity[]>;
};

export type CreateGame = NullToOptional<Omit<OmitPromises<GameEntity>, 'id'>>;

export type UpdateGame = Partial<CreateGame>;

export type SummaryGame = Simplify<Pick<GameEntity, 'id' | 'name' | 'slug' | 'type' | 'price' | 'ageRating' | 'comingSoon' | 'headerImage' | 'shortDescription'> & { wishlisted?: boolean }>;

export type GameDetail = Simplify<OmitPromises<GameEntity> & {
  tags: GameTag[];
  developers: GameDeveloper[];
  publishers: GamePublisher[];
  platforms: GamePlatform | null;
  media: Media[];
  series: Series | null;
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
  }
  release?: {
    when?: 'exact' | 'before' | 'after' | 'coming-soon';
    date?: Date;
  }
  order: {
    by: 'popular' | 'price';
    asc?: boolean;
  }
}

export type AdvancedSearchGameOptions = Simplify<SearchGameOptions & {
  tags?: number[];
  developers?: number[];
  publishers?: number[];
  platforms?: GamePlatform;
}>

export type SearchBody = Omit<SearchGameOptions, 'name'>;

export type AdvancedSearchBody = Omit<AdvancedSearchGameOptions, 'name'>;