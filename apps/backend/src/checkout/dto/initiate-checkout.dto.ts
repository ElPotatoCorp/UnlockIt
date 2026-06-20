import { ApiProperty } from '@nestjs/swagger';
import { ExactData, InitiateCheckout } from '@unlockit/shared';
import { IsBoolean } from 'class-validator';

export class InitiateCheckoutDto implements InitiateCheckout {
  @ApiProperty({
    title: 'Use Wallet',
    description: 'A boolean to either split the bill between the wallet and stripe or using stripe only. For now, you can only use through the wallet',
    type: Boolean
  })
  @IsBoolean()
  useWallet: boolean;
}

const _assertExact: ExactData<InitiateCheckout, InitiateCheckoutDto> = true;
