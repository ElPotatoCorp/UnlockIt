import { OrderDetailDto } from "./dto/order-detail.dto";
import { OrderItemDto } from "./dto/order-item.dto";
import { GameMapper } from "src/games/game.mapper";
import { SummaryOrderDto } from "./dto/summary-order.dto";
import { OrderEntity } from "./entities/order.entity";
import { OrderItemEntity } from "./entities/order-item.entity";

export class OrderMapper {
  static toSummary(order: OrderEntity) {
    const dto = new SummaryOrderDto();

    dto.id = order.id;
    dto.status = order.status;
    dto.amountPaidWallet = order.amountPaidWallet;
    dto.amountPaidStripe = order.amountPaidStripe;
    dto.reservedAt = order.reservedAt;
    dto.completedAt = order.completedAt;

    return dto;
  }

  static toDetail(order: OrderEntity) {
    const dto = new OrderDetailDto();

    dto.id = order.id;
    dto.status = order.status;
    dto.amountPaidWallet = order.amountPaidWallet;
    dto.amountPaidStripe = order.amountPaidStripe;
    dto.reservedAt = order.reservedAt;
    dto.completedAt = order.completedAt;
    dto.items = order.items.map(item => this.toItem(item));

    return dto;
  }

  static toItem(item: OrderItemEntity) {
    const dto = new OrderItemDto();

    dto.game = GameMapper.toSummary(item.game);
    dto.quantity = item.quantity;
    dto.unitPrice = item.unitPrice;
    dto.keys = item.stocks.map(stockRow => stockRow.productKey);

    return dto;
  }
}