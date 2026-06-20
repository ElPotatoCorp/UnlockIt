import { OrderDto } from "./dto/order.dto";
import { OrderItemDto } from "./dto/order-item.dto";
import { GameMapper } from "src/games/game.mapper";
import { OrderSummaryDto } from "./dto/summary-order.dto";
import { OrderEntity } from "./entities/order.entity";
import { OrderItemEntity } from "./entities/order-item.entity";
import { CheckoutResultDto } from "src/checkout/dto/checkout-result.dto";

export class OrderMapper {
  static toOrder(order: OrderEntity) {
    const dto = new OrderDto();
  
    dto.id = order.id;
    dto.status = order.status;
    dto.amountPaidWallet = order.amountPaidWallet;
    dto.amountPaidStripe = order.amountPaidStripe;
    dto.createdAt = order.createdAt;
    dto.completedAt = order.completedAt;
    dto.items = order.items.map(item => this.toItem(item));
  
    return dto;
  }

  static toSummary(order: OrderEntity) {
    const dto = new OrderSummaryDto();

    dto.id = order.id;
    dto.status = order.status;
    dto.amountPaidWallet = order.amountPaidWallet;
    dto.amountPaidStripe = order.amountPaidStripe;
    dto.createdAt = order.createdAt;
    dto.completedAt = order.completedAt;

    return dto;
  }

  static toItem(item: OrderItemEntity) {
    const dto = new OrderItemDto();

    dto.game = GameMapper.toSummary(item.game);
    dto.quantity = item.quantity;
    dto.unitPrice = item.unitPrice;

    return dto;
  }

  static toCheckout(
    order: OrderDto,
    clientSecret: string | null,
  ) {
    const dto = new CheckoutResultDto();

    dto.order = order;
    dto.clientSecret = clientSecret;

    return dto;
  }
}