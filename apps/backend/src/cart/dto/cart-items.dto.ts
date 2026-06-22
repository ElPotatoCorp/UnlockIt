import { SummaryGameDto } from 'src/games/dto/summary-game.dto';
import { CartItem, ExactData } from '@unlockit/shared';
import { CartItemEntityDoc } from 'src/docs/carts/entities/cart-item.entity.doc';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto implements CartItem {
  @ApiProperty({
    title: 'Game',
    description: 'Summary of the game',
    type: SummaryGameDto,
  })
  game: SummaryGameDto;

  @CartItemEntityDoc.Quantity()
  quantity: number;

  @CartItemEntityDoc.Selected()
  selected: boolean;

  @CartItemEntityDoc.AddedAt()
  addedAt: Date;
}

const _assertExact: ExactData<CartItem, CartItemDto> = true;
