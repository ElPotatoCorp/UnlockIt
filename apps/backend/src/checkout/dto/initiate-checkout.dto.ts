import { ExactData, InitiateCheckout } from '@unlockit/shared';
import { IsBoolean } from 'class-validator';

export class InitiateCheckoutDto implements InitiateCheckout {
  @IsBoolean()
  useWallet: boolean;
}

const _assertExact: ExactData<InitiateCheckout, InitiateCheckoutDto> = true;
