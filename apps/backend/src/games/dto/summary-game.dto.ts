import { GamePrimitiveEntityDoc } from 'src/docs/games/entities/game-primitive.entity.doc';
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
}

const _assertExact: ExactData<SummaryGame, SummaryGameDto> = true;
