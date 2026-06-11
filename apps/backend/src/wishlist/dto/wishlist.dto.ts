import { ExactData, SummaryGame, Wishlist } from "@unlockit/shared";
import { WishlistEntity } from "../entities/wishlist.entity";

export class WishlistDto implements Wishlist {
  game: SummaryGame;
  addedAt: Date;

  static async fromEntity(wishlist: WishlistEntity): Promise<WishlistDto> {
    const dto = new WishlistDto();

    dto.game = await wishlist.game;
    dto.addedAt = wishlist.addedAt;

    return dto;
  }
}

const _assertExact: ExactData<Wishlist, WishlistDto> = true;
