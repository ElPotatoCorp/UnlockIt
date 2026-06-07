import { GameEntityDoc } from 'src/docs/games/entities/game.entity.doc';
import { GameEntity } from '../entities/game.entity';
import { EUAgeRating, GameType } from '@unlockit/shared';

export class SummaryGameDto {
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

  @GameEntityDoc.ComingSoon()
  comingSoon: boolean;

  @GameEntityDoc.HeaderImage()
  headerImage: string;

  @GameEntityDoc.ShortDescription()
  shortDescription: string;

  static fromEntity(game: GameEntity): SummaryGameDto {
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
    return dto;
  }
}
