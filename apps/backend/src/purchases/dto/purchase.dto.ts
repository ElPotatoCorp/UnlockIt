import { ExactData, Purchase } from '@unlockit/shared';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class PurchaseDto implements Purchase {
  orderId: string;
  game: SummaryGameDto;
  unitPrice: number;
  quantity: number;
  orderedAt: Date;
  review: null;
}

const _assertExact: ExactData<Purchase, PurchaseDto> = true;
