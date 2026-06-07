import { GameEntity } from 'src/games/entities/game.entity';
import { EUAgeRating, GameDetail, GameDeveloper, GamePlatform, GamePublisher, GameTag, GameType, LangCode, Media, Tag } from '@unlockit/shared';
import { SummarySeriesDto } from 'src/series/dto/summary-series.dto';

export class GameDetailDto implements GameDetail {
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
  tags: GameTag[];
  developers: GameDeveloper[];
  publishers: GamePublisher[];
  platforms: GamePlatform | null;
  media: Media[];
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

    const [tags, developers, publishers, platforms, media, series] = await Promise.all([
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
    dto.series = await SummarySeriesDto.fromEntity(series);

    if (platforms) {
      const { gameId: _, game: __, ...platformFlags } = platforms as any;
      dto.platforms = platformFlags;
    } else {
      dto.platforms = null;
    }

    return dto;
  }
}