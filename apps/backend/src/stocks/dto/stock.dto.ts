import { ExactData, Stock } from "@unlockit/shared";
import { StockEntity } from "../entities/stock.entity";

export class StockDto implements Stock {
  productKeys: string[];

  static fromEntities(stocks: StockEntity[]): StockDto {
    const dto = new StockDto();

    dto.productKeys = stocks.map(stock => stock.productKey);

    return dto;
  }
}

const _assertExact: ExactData<Stock, StockDto> = true;