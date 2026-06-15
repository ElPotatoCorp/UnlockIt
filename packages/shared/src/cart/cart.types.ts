import { GameEntity, SummaryGame } from "../game/game.types";
import { UserEntity } from "../user/user.types";
import { Simplify } from "../utils/types";

export type CartEntity = {
  id: string;
  userId: string;
  user: UserEntity;
  items: CartItemEntity[];
}

export type CartItemEntity = {
  cartId: string;
  gameId: number;
  cart: CartEntity;
  game: GameEntity;
  quantity: number;
  selected: boolean;
  addedAt: Date;
}

export type CartItem = Simplify<{
  game: SummaryGame;
} & Pick<CartItemEntity, 'quantity' | 'selected' | 'addedAt'>>;
