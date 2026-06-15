import {
  ExactData,
  WalletTransaction,
  WalletTransactionType,
} from '@unlockit/shared';

export class WalletTransactionDto implements WalletTransaction {
  id: string;
  orderId: string | null;
  amount: number;
  type: WalletTransactionType;
  createdAt: Date;
}

const _assertExact: ExactData<WalletTransaction, WalletTransactionDto> = true;
