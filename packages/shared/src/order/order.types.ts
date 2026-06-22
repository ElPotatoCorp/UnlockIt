import { OrderStatus } from './order.enums';
import { GameEntity, SummaryGame } from '../game/game.types';
import { StockEntity } from '../stock/stock.types';
import { UserEntity } from '../user/user.types';
import { WalletTransactionEntity } from '../wallet/wallet.types';
import { Simplify } from '../utils/types';

export type OrderEntity = {
  id: string;
  userId: string | null;
  status: OrderStatus;
  amountPaidWallet: number;
  amountPaidStripe: number;
  createdAt: Date;
  completedAt: Date | null;

  user: UserEntity | null;
  items: OrderItemEntity[];
  walletTransactions: WalletTransactionEntity[];
};
type OrderRelationKeys = 'user' | 'items' | 'walletTransactions';

export type OrderItemEntity = {
  orderId: string;
  gameId: number;
  quantity: number;
  /** Snapshot of `game.price` at the moment of purchase. */
  unitPrice: number;

  order: OrderEntity;
  game: GameEntity;
  stocks: StockEntity[];
};
type OrderItemRelationKeys = 'order' | 'game' | 'stocks';

/** A single line in an order as seen by the user. */
export type OrderItem = {
  game: SummaryGame;
  quantity: number;
  unitPrice: number;
};

/** Full order with all line items. Used in detail views and checkout response. */
export type Order = Simplify<Omit<OrderEntity, 'userId' | OrderRelationKeys> & {
  items: OrderItem[];
}>;

/** Order metadata without line items. Used in paginated list views. */
export type OrderSummary = Omit<Order, 'items'>;

// -------------------------------------------------------
// Checkout
// -------------------------------------------------------

export type InitiateCheckout = {
  useWallet: boolean;
};

/** Returned by POST /checkout for both wallet-only and Stripe flows (when it will be implemented). */
export type CheckoutResult = {
  order: Order;
  /**
   * Present when Stripe is required to cover the remaining balance.
   * Null when the wallet covers 100% of the order total.
   */
  clientSecret: string | null;
};
