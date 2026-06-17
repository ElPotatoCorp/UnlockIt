import {
  EUAgeRating,
  ExactData,
  GameDetail,
  GameType,
  LangCode,
} from '@unlockit/shared';
import { SeriesDto } from 'src/series/dto/series.dto';
import { GamePublisherDto } from 'src/publishers/dto/game-publisher.dto';
import { GameDeveloperDto } from 'src/developers/dto/game-developer.dto';
import { MediaDto } from 'src/media/dto/media.dto';
import { GameTagDto } from 'src/tags/dto/game-tag.dto';
import { GamePlatformDto } from 'src/platforms/dto/game-platform.dto';
import { GamePrimitiveEntityDoc } from 'src/docs/games/entities/game-primitive.entity.doc';
import { GameRelationsEntityDoc } from 'src/docs/games/entities/game-relations.entity.doc';
import { ReviewDto } from 'src/reviews/dto/review.dto';

export class GameDetailDto implements GameDetail {
  @GamePrimitiveEntityDoc.Id()
  id: number;

  @GamePrimitiveEntityDoc.Name()
  name: string;

  @GamePrimitiveEntityDoc.Slug()
  slug: string;

  @GamePrimitiveEntityDoc.Type()
  type: GameType;

  @GamePrimitiveEntityDoc.Price()
  price: number;

  @GamePrimitiveEntityDoc.AgeRating()
  ageRating: EUAgeRating;

  @GamePrimitiveEntityDoc.ReleaseDate()
  releaseDate: string | null;

  @GamePrimitiveEntityDoc.ComingSoon()
  comingSoon: boolean;

  @GamePrimitiveEntityDoc.HeaderImage()
  headerImage: string;

  @GamePrimitiveEntityDoc.CoverImage()
  coverImage: string;

  @GamePrimitiveEntityDoc.BackgroundImage()
  backgroundImage: string;

  @GamePrimitiveEntityDoc.ShortDescription()
  shortDescription: string;

  @GamePrimitiveEntityDoc.DetailedDescription()
  detailedDescription: string;

  @GamePrimitiveEntityDoc.MetacriticScore()
  metacriticScore: number | null;

  @GamePrimitiveEntityDoc.Website()
  website: string | null;

  @GamePrimitiveEntityDoc.PcRequirements()
  pcRequirements: string | null;

  @GamePrimitiveEntityDoc.SupportedLanguages()
  supportedLanguages: LangCode[];

  @GameRelationsEntityDoc.Tags()
  tags: GameTagDto[];

  @GameRelationsEntityDoc.Developers()
  developers: GameDeveloperDto[];

  @GameRelationsEntityDoc.Publishers()
  publishers: GamePublisherDto[];

  @GameRelationsEntityDoc.Platforms()
  platforms: GamePlatformDto;

  @GameRelationsEntityDoc.Media()
  media: MediaDto[];

  @GameRelationsEntityDoc.Series()
  series?: SeriesDto;

  reviews: ReviewDto[];

  wishlisted?: boolean;
}

const _assertExact: ExactData<GameDetail, GameDetailDto> = true;
