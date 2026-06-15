import { ExactData, Stock } from '@unlockit/shared';

export class StockDto implements Stock {
  productKeys: string[];
}

const _assertExact: ExactData<Stock, StockDto> = true;
