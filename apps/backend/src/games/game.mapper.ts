import { ReviewMapper } from 'src/reviews/review.mapper';
import { GameDetailDto } from './dto/game-detail.dto';
import { SummaryGameDto } from './dto/summary-game.dto';
import { GameEntity } from './entities/game.entity';

export class GameMapper {
  static toDetail(game: GameEntity, wishlisted?: boolean) {
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

    // --- Relations ---
    dto.tags = game.tags;
    dto.developers = game.developers;
    dto.publishers = game.publishers;
    dto.media = game.media;
    dto.platforms = game.platforms;

    if (game.series) dto.series = game.series;

    dto.wishlisted = wishlisted;

    return dto;
  }

  static toSummary(game: GameEntity, wishlisted?: boolean) {
    const dto = new SummaryGameDto();

    dto.id = game.id;
    dto.name = game.name;
    dto.slug = game.slug;
    dto.type = game.type;
    dto.price = game.price;
    dto.ageRating = game.ageRating;
    dto.comingSoon = game.comingSoon;
    dto.headerImage = game.headerImage;
    dto.shortDescription = game.shortDescription;
    dto.wishlisted = wishlisted;

    return dto;
  }
}
