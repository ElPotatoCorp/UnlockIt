import { StockDto } from './dto/stock.dto';
import { StockEntity } from './entities/stock.entity';

export class StockMapper {
  static toStock(stocks: StockEntity[]) {
    const dto = new StockDto();
    dto.productKeys = stocks.map((stock) => stock.productKey);
    return dto;
  }
}
