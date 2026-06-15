import {
  ExactData,
  OrderItem,
} from '@unlockit/shared';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class OrderItemDto implements OrderItem {
  game: SummaryGameDto;
  quantity: number;
  unitPrice: number;
  keys: string[];
}

const _assertExact: ExactData<OrderItem, OrderItemDto> = true;
