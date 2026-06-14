import { ExactData, WalletBalance } from '@unlockit/shared';

export class WalletBalanceDto implements WalletBalance {
  balance: number;
}

const _assertExact: ExactData<WalletBalance, WalletBalanceDto> = true;
