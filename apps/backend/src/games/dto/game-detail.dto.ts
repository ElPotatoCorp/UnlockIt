import { GameEntity } from 'src/games/entities/game.entity';
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
  supportedLanguages: LangCode[] | null;

  @GameRelationsEntityDoc.Tags()
  tags: GameTagDto[];

  @GameRelationsEntityDoc.Developers()
  developers: GameDeveloperDto[];

  @GameRelationsEntityDoc.Publishers()
  publishers: GamePublisherDto[];

  @GameRelationsEntityDoc.Platforms()
  platforms: GamePlatformDto | null;

  @GameRelationsEntityDoc.Media()
  media: MediaDto[];

  @GameRelationsEntityDoc.Series()
  series: SeriesDto | null;

  wishlisted?: boolean;

  static async fromEntity(
    game: GameEntity,
    wishlisted?: boolean,
  ): Promise<GameDetailDto> {
    const dto = new GameDetailDto();

    dto.id = game.id;
    dto.name = game.name;
    dto.slug = game.slug;
    dto.type = game.type;
    dto.price = game.price;
    dto.ageRating = game.ageRating;
    dto.releaseDate = game.releaseDate;
    dto.comingSoon = game.comingSoon;
    dto.headerImage = game.headerImage;
    dto.coverImage = game.coverImage;
    dto.backgroundImage = game.backgroundImage;
    dto.shortDescription = game.shortDescription;
    dto.detailedDescription = game.detailedDescription;
    dto.metacriticScore = game.metacriticScore;
    dto.website = game.website;
    dto.pcRequirements = game.pcRequirements;
    dto.supportedLanguages = game.supportedLanguages;

    const [tags, developers, publishers, platforms, media, series] =
      await Promise.all([
        game.tags,
        game.developers,
        game.publishers,
        game.platforms,
        game.media,
        game.series,
      ]);

    dto.tags = tags.map(({ id, name }) => ({ id, name }));
    dto.developers = developers.map(({ id, name }) => ({ id, name }));
    dto.publishers = publishers.map(({ id, name }) => ({ id, name }));
    dto.media = media.map(({ id, url, type }) => ({ id, url, type }));
    dto.series = series ? await SeriesDto.fromEntity(series) : null;
    dto.platforms = platforms ? GamePlatformDto.fromEntity(platforms) : null;

    dto.wishlisted = wishlisted;

    return dto;
  }
}

const _assertExact: ExactData<GameDetail, GameDetailDto> = true;
