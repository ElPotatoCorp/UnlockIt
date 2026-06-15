import { CartItemDto } from "./dto/cart-items.dto";
import { GameMapper } from "src/games/game.mapper";
import { CartItemEntity } from "./entities/cart-item.entity";

export class CartMapper {
  static toItem(cartItem: CartItemEntity) {
    const dto = new CartItemDto();

    dto.game = GameMapper.toSummary(cartItem.game);
    dto.quantity = cartItem.quantity;
    dto.selected = cartItem.selected;
    dto.addedAt = cartItem.addedAt;

    return dto;
  }
}