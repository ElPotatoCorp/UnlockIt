import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { CartItem, ExactData } from '@unlockit/shared';

export class CartItemDto implements CartItem {
  game: SummaryGameDto;
  quantity: number;
  selected: boolean;
  addedAt: Date;
}

const _assertExact: ExactData<CartItem, CartItemDto> = true;
