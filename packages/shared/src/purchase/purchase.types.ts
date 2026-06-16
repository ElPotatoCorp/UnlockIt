import { SummaryGame } from '../game/game.types';

export type PurchaseSummary = {
  orderId: string;
  game: SummaryGame;
  unitPrice: number;
  quantity: number;
  orderedAt: Date;
};

export type Purchase = PurchaseSummary & {
  /** Reserved for the reviews module. Always null until implemented. */
  review: null;
};

export type PurchaseKeys = {
  keys: string[];
};
