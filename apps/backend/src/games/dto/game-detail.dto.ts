import { GameEntity } from 'src/games/entities/game.entity';
import { EUAgeRating, GameDetail, GameType, LangCode } from '@unlockit/shared';
import { SummarySeriesDto } from 'src/series/dto/summary-series.dto';
import { GamePublisherDto } from 'src/publishers/dto/game-publisher.dto';
import { GameDeveloperDto } from 'src/developers/dto/game-developer.dto';
import { MediaDto } from 'src/media/dto/media.dto';
import { GameTagDto } from 'src/tags/dto/game-tag.dto';
import { GamePlatformDto } from 'src/platforms/dto/game-platform.dto';
import { GameEntityDoc } from 'src/docs/games/entities/game.entity.doc';

export class GameDetailDto implements GameDetail {
  @GameEntityDoc.Id()
  id: number;

  @GameEntityDoc.Name()
  name: string;

  @GameEntityDoc.Slug()
  slug: string;

  @GameEntityDoc.Type()
  type: GameType;

  @GameEntityDoc.Price()
  price: number;

  @GameEntityDoc.AgeRating()
  ageRating: EUAgeRating;

  @GameEntityDoc.ReleaseDate()
  releaseDate: string | null;

  @GameEntityDoc.ComingSoon()
  comingSoon: boolean;

  @GameEntityDoc.HeaderImage()
  headerImage: string;

  @GameEntityDoc.CoverImage()
  coverImage: string;

  @GameEntityDoc.BackgroundImage()
  backgroundImage: string;

  @GameEntityDoc.ShortDescription()
  shortDescription: string;

  @GameEntityDoc.DetailedDescription()
  detailedDescription: string;

  @GameEntityDoc.MetacriticScore()
  metacriticScore: number | null;

  @GameEntityDoc.Website()
  website: string | null;

  @GameEntityDoc.PcRequirements()
  pcRequirements: string | null;

  @GameEntityDoc.SupportedLanguages()
  supportedLanguages: LangCode[] | null;

  //@GameEntityDoc.Name()
  tags: GameTagDto[];

  //@GameEntityDoc.Name()
  developers: GameDeveloperDto[];

  //@GameEntityDoc.Name()
  publishers: GamePublisherDto[];

  //@GameEntityDoc.Name()
  platforms: GamePlatformDto | null;

  //@GameEntityDoc.Name()
  media: MediaDto[];

  //@GameEntityDoc.Name()
  series: SummarySeriesDto | null;

  static async fromEntity(game: GameEntity): Promise<GameDetailDto> {
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
    dto.series = series ? await SummarySeriesDto.fromEntity(series) : null;
    dto.platforms = platforms ? GamePlatformDto.fromEntity(platforms) : null;

    return dto;
  }
}
