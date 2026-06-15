import { ExactData, SummaryGame, Wishlist } from '@unlockit/shared';

export class WishlistDto implements Wishlist {
  game: SummaryGame;
  addedAt: Date;
}

const _assertExact: ExactData<Wishlist, WishlistDto> = true;
