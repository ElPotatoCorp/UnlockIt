import { SummaryGame } from '../game/game.types';
import { Review } from '../review/review.types';
import { Simplify } from '../utils/types';

export type PurchaseSummary = {
  orderId: string;
  game: SummaryGame;
  unitPrice: number;
  quantity: number;
  orderedAt: Date;
};

export type Purchase = Simplify<PurchaseSummary & {
  review: Review | null;
}>;

export type PurchaseKeys = {
  keys: string[];
};
