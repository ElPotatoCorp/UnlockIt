import { GameEntity } from "../game/game.types";

export type StockEntity = {
  id: number;
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