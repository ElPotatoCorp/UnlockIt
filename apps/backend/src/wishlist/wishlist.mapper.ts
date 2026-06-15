import { WishlistDto } from "./dto/wishlist.dto";
import { WishlistEntity } from "./entities/wishlist.entity";

export class WishlistMapper {
  static toWishlist(wishlist: WishlistEntity) {
    const dto = new WishlistDto();

    dto.game = wishlist.game;
    dto.addedAt = wishlist.addedAt;

    return dto;
  }
}