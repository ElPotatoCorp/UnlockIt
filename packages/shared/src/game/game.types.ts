import { Developer, DeveloperEntity } from "../developer/developer.types";
import { GamePlatform, GamePlatformEntity } from "../game-platform/game-platform.types";
import { Media, MediaEntity } from "../media/media.types";
import { Publisher, PublisherEntity } from "../publisher/publisher.types";
import { SummarySeries, SeriesEntity } from "../series/series.types";
import { Tag, TagEntity } from "../tag/tag.types";
import { NullToOptional } from "../utils/types";
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

export type CreateGame = NullToOptional<Omit<GameEntity, 'id' | 'series' | 'tags' | 'developers' | 'publishers' | 'platforms' | 'media'>>;

export type UpdateGame = Partial<CreateGame>;

export type SummaryGame = Pick<GameEntity, 'id' | 'name' | 'slug' | 'type' | 'price' | 'ageRating' | 'comingSoon' | 'headerImage' | 'shortDescription'>;

export type GameDetail = Omit<GameEntity, 'series' | 'tags' | 'developers' | 'publishers' | 'platforms' | 'media'> & {
  tags: Tag[];
  developers: Developer[];
  publishers: Publisher[];
  platforms: GamePlatform | null;
  media: Media[];
  series: SummarySeries | null;
}