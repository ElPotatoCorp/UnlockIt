import { ApiProperty } from '@nestjs/swagger';
import {
  ExactData,
  OrderItem,
} from '@unlockit/shared';
import { OrderEntityDoc } from 'src/docs/orders/entities/order.entity.doc';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class OrderItemDto implements OrderItem {
  @ApiProperty({
    title: 'Summary of the game',
    type: SummaryGameDto,
  })
  game: SummaryGameDto;

  @OrderEntityDoc.Quantity()
  quantity: number;

  @OrderEntityDoc.UnitPrice()
  unitPrice: number;
}

const _assertExact: ExactData<OrderItem, OrderItemDto> = true;
