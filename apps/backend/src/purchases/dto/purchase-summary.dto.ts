import { ExactData, PurchaseSummary } from '@unlockit/shared';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class PurchaseSummaryDto implements PurchaseSummary {
  orderId: string;
  game: SummaryGameDto;
  unitPrice: number;
  quantity: number;
  orderedAt: Date;
}

const _assertExact: ExactData<PurchaseSummary, PurchaseSummaryDto> = true;
