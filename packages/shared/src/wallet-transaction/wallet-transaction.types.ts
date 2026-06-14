import { WalletTransactionType } from './wallet-transaction.enums';
import { UserEntity } from '../user/user.types';
import { OmitPromises } from '../utils/types';
import { OrderEntity } from '../order/order.types';

export type WalletTransactionEntity = {
  id: string;
  userId: string;
  orderId: string | null;
  /**
   * Positive = credit (TOP_UP, REFUND)
   * Negative = debit (PURCHASE)
   */
  amount: number;
  type: WalletTransactionType;
  createdAt: Date;

  user: Promise<UserEntity>;

  order: Promise<OrderEntity>
};

export type WalletTransaction = Omit<OmitPromises<WalletTransactionEntity>, 'userId'>;

export type WalletBalance = {
  balance: number;
};

export type TopUpWallet = {
  amount: number;
};
