import { ExactData, PurchaseKeys } from '@unlockit/shared';

export class PurchaseKeysDto implements PurchaseKeys {
  keys: string[];
}

const _assertExact: ExactData<PurchaseKeys, PurchaseKeysDto> = true;
