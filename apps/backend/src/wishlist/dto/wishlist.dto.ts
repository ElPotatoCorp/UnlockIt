import { SummaryGame, Wishlist } from "@unlockit/shared";
import { WishlistEntity } from "../entities/wishlist.entity";

export class WishlistDto implements Wishlist {
  game: SummaryGame;
  addedAt: Date;

  static fromEntity(wishlist: WishlistEntity): WishlistDto {
    const dto = new WishlistDto();

    dto.game = wishlist.game;
    dto.addedAt = wishlist.addedAt;

    return dto;
  }
}