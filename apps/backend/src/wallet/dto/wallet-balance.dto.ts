import { ApiProperty } from '@nestjs/swagger';
import { ExactData, WalletBalance } from '@unlockit/shared';

export class WalletBalanceDto implements WalletBalance {
  @ApiProperty({
    title: 'Balance of the account',
    type: Number,
    minimum: 0,
    example: 70,
  })
  balance: number;
}

const _assertExact: ExactData<WalletBalance, WalletBalanceDto> = true;
