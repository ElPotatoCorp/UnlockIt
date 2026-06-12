import { GamePrimitiveEntityDoc } from 'src/docs/games/entities/game-primitive.entity.doc';
import { GameEntity } from '../entities/game.entity';
import {
  EUAgeRating,
  ExactData,
  GameType,
  SummaryGame,
} from '@unlockit/shared';

export class SummaryGameDto implements SummaryGame {
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

  @GamePrimitiveEntityDoc.ComingSoon()
  comingSoon: boolean;

  @GamePrimitiveEntityDoc.HeaderImage()
  headerImage: string;

  @GamePrimitiveEntityDoc.ShortDescription()
  shortDescription: string;

  wishlisted?: boolean;

  static fromEntity(game: GameEntity, wishlisted?: boolean): SummaryGameDto {
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

const _assertExact: ExactData<SummaryGame, SummaryGameDto> = true;
