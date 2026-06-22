import { ExactData, Purchase } from '@unlockit/shared';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { ReviewDto } from 'src/reviews/dto/review.dto';

export class PurchaseDto implements Purchase {
  orderId: string;

  game: SummaryGameDto;

  unitPrice: number;
  quantity: number;

  orderedAt: Date;

  review: ReviewDto | null;
}

const _assertExact: ExactData<Purchase, PurchaseDto> = true;
