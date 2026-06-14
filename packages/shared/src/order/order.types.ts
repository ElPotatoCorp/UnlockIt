import { OrderStatus } from './order.enums';
import { GameEntity, SummaryGame } from '../game/game.types';
import { StockEntity } from '../stock/stock.types';
import { UserEntity } from '../user/user.types';
import { WalletTransactionEntity } from '../wallet-transaction/wallet-transaction.types';
import { OmitPromises, Simplify } from '../utils/types';

export type OrderEntity = {
  id: string;
  userId: string;
  status: OrderStatus;
  amountPaidWallet: number;
  amountPaidStripe: number;
  reservedAt: Date;
  completedAt: Date | null;

  user: Promise<UserEntity>;
  items: Promise<OrderItemEntity[]>;
  walletTransactions: Promise<WalletTransactionEntity[]>;
};

export type OrderItemEntity = {
  orderId: string;
  gameId: number;
  quantity: number;
  /** Snapshot of `game.price` at the moment of purchase. */
  unitPrice: number;

  order: OrderEntity;
  game: Promise<GameEntity>;
  stocks: Promise<StockEntity[]>;
};

/** A single line in an order as seen by the user. */
export type OrderItem = {
  game: SummaryGame;
  quantity: number;
  unitPrice: number;
  /** Populated only when order status is COMPLETED. */
  keys: string[];
};

/** Full order with all line items. Used in detail views and checkout response. */
export type Order = Simplify<Omit<OmitPromises<OrderEntity>, 'userId'> & {
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
