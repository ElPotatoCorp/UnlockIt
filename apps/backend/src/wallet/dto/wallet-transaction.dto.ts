import { ExactData, WalletTransaction, WalletTransactionType } from '@unlockit/shared';
import { WalletTransactionEntity } from '../entities/wallet-transaction.entity';

export class WalletTransactionDto implements WalletTransaction {
  id: string;
  orderId: string | null;
  amount: number;
  type: WalletTransactionType;
  createdAt: Date;

  static fromEntity(entity: WalletTransactionEntity): WalletTransactionDto {
    const dto = new WalletTransactionDto();

    dto.id = entity.id;
    dto.orderId = entity.orderId;
    dto.amount = entity.amount;
    dto.type = entity.type;
    dto.createdAt = entity.createdAt;

    return dto;
  }
}

const _assertExact: ExactData<WalletTransaction, WalletTransactionDto> = true;
