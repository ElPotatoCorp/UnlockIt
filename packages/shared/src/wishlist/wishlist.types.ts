import { GameEntity, SummaryGame } from "../game/game.types";
import { UserEntity } from "../user/user.types";

export type WishlistEntity = {
  userId: string;
  gameId: number;
  user: UserEntity;
  game: GameEntity;
  addedAt: Date;
}

export type Wishlist = {
  game: SummaryGame;
  addedAt: Date;
}