import { SummaryGameDto } from "src/games/dto/summary-game.dto";
import { CartItemEntity } from "../entities/cart-item.entity";

export class CartItemDto {
  game: SummaryGameDto;
  quantity: number;
  selected: boolean;
  addedAt: Date;

  static async fromEntity(cartItem: CartItemEntity): Promise<CartItemDto> {
    const dto = new CartItemDto();

    dto.game = SummaryGameDto.fromEntity(await cartItem.game);
    dto.quantity = cartItem.quantity;
    dto.selected = cartItem.selected;
    dto.addedAt = cartItem.addedAt;

    return dto;
  }
}