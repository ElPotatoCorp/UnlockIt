import { WalletTransactionDto } from "./dto/wallet-transaction.dto";
import { WalletTransactionEntity } from "./entities/wallet-transaction.entity";

export class WalletMapper {
  static toWalletTransaction(walletTransaction: WalletTransactionEntity) {
    const dto = new WalletTransactionDto();

    dto.id = walletTransaction.id;
    dto.orderId = walletTransaction.orderId;
    dto.amount = walletTransaction.amount;
    dto.type = walletTransaction.type;
    dto.createdAt = walletTransaction.createdAt;

    return dto;
  }
}