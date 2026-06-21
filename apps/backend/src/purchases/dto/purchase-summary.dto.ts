import { ApiProperty } from '@nestjs/swagger';
import { ExactData, PurchaseSummary } from '@unlockit/shared';
import { OrderEntityDoc } from 'src/docs/orders/entities/order.entity.doc';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class PurchaseSummaryDto implements PurchaseSummary {
  @OrderEntityDoc.Id(false)
  orderId: string;

  @ApiProperty({ type: SummaryGameDto })
  game: SummaryGameDto;

  @OrderEntityDoc.UnitPrice()
  unitPrice: number;

  @OrderEntityDoc.Quantity()
  quantity: number;

  @ApiProperty({
    title: 'Ordered At',
    description: 'The date when the order was done',
    type: Date,
    example: new Date(),
  })
  orderedAt: Date;
}

const _assertExact: ExactData<PurchaseSummary, PurchaseSummaryDto> = true;
