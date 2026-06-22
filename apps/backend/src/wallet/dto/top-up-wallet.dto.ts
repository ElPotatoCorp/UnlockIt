import { ApiProperty } from '@nestjs/swagger';
import { ExactData, TopUpWallet } from '@unlockit/shared';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class TopUpWalletDto implements TopUpWallet {
  @ApiProperty({
    title: 'Amount',
    description: 'The amount to top-up the wallet with.',
    type: Number,
    minimum: 5.0,
    example: 50,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(5.0)
  @Type(() => Number)
  amount: number;
}

const _assertExact: ExactData<TopUpWallet, TopUpWalletDto> = true;
