import { GameEntity } from "../game/game.types";
import { OrderItemEntity } from "../order/order.types";

export type StockEntity = {
  id: number;
  productKey: string;
  gameId: number;
  orderId: string | null;
  usedAt: Date | null;

  game: GameEntity;
  orderItem: OrderItemEntity | null;
}

export type Stock = {
  productKeys: string[];
}

export type CreateStock = {
  productKeys: string[];
}