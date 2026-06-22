import { PurchaseDto } from './dto/purchase.dto';
import { GameMapper } from 'src/games/game.mapper';
import { PurchaseKeysDto } from './dto/purchase-keys.dto';
import { PurchaseSummaryDto } from './dto/purchase-summary.dto';
import { OrderItemEntity } from 'src/orders/entities/order-item.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { ReviewMapper } from 'src/reviews/review.mapper';
import { ReviewEntity } from 'src/reviews/entities/review.entity';

export class PurchaseMapper {
  static toPurchase(item: OrderItemEntity, review?: ReviewEntity): PurchaseDto {
    const dto = new PurchaseDto();

    dto.orderId = item.orderId;
    dto.game = GameMapper.toSummary(item.game);
    dto.unitPrice = item.unitPrice;
    dto.quantity = item.quantity;
    dto.orderedAt = item.order.createdAt;
    dto.review = review ? ReviewMapper.toReview(review) : null;

    return dto;
  }

  static toSummary(item: OrderItemEntity): PurchaseSummaryDto {
    const dto = new PurchaseSummaryDto();

    dto.orderId = item.orderId;
    dto.game = GameMapper.toSummary(item.game);
    dto.unitPrice = item.unitPrice;
    dto.quantity = item.quantity;
    dto.orderedAt = item.order.createdAt;

    return dto;
  }

  static toKeys(stocks: StockEntity[]): PurchaseKeysDto {
    const dto = new PurchaseKeysDto();

    dto.keys = stocks.map((s) => s.productKey);

    return dto;
  }
}
