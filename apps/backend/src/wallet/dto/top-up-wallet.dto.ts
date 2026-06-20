import { ExactData, TopUpWallet } from '@unlockit/shared';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import { WalletTransactionEntityDoc } from 'src/docs/wallet/entities/wallet-transaction.entity.doc';

export class TopUpWalletDto implements TopUpWallet {
  @WalletTransactionEntityDoc.Amount()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  amount: number;
}

const _assertExact: ExactData<TopUpWallet, TopUpWalletDto> = true;
