import { GameEntity } from "../game/game.types";

export type StockEntity = {
  productKey: string;
  gameId: number;
  game: GameEntity;
  usedAt: Date | null;
}

export type Stock = {
  productKeys: string[];
}

export type CreateStock = {
  productKeys: string[];
}