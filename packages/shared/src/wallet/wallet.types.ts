import { WalletTransactionType } from './wallet.enums';
import { UserEntity } from '../user/user.types';
import { OrderEntity } from '../order/order.types';

export type WalletTransactionEntity = {
  id: string;
  userId: string | null;
  orderId: string | null;
  /**
   * Positive = credit (TOP_UP, REFUND)
   * Negative = debit (PURCHASE)
   */
  amount: number;
  type: WalletTransactionType;
  createdAt: Date;

  user: UserEntity;

  order: OrderEntity;
};

export type WalletTransaction = Omit<WalletTransactionEntity, 'userId' | 'user' | 'order'>;

export type WalletBalance = {
  balance: number;
};

export type TopUpWallet = {
  amount: number;
};
