import {
  ExactData,
  WalletTransaction,
  WalletTransactionType,
} from '@unlockit/shared';
import { WalletTransactionEntityDoc } from 'src/docs/wallet/entities/wallet-transaction.entity.doc';

export class WalletTransactionDto implements WalletTransaction {
  @WalletTransactionEntityDoc.Id(false)
  id: string;

  @WalletTransactionEntityDoc.OrderId(false)
  orderId: string | null;

  @WalletTransactionEntityDoc.Amount()
  amount: number;

  @WalletTransactionEntityDoc.Type()
  type: WalletTransactionType;

  @WalletTransactionEntityDoc.CreatedAt()
  createdAt: Date;
}

const _assertExact: ExactData<WalletTransaction, WalletTransactionDto> = true;
