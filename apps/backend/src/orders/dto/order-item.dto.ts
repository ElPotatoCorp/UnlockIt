import { ExactData, OrderItem, OrderStatus } from '@unlockit/shared';
import { OrderItemEntity } from '../entities/order-item.entity';
import { GameEntity } from 'src/games/entities/game.entity';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class OrderItemDto implements OrderItem {
  game: SummaryGameDto;
  quantity: number;
  unitPrice: number;
  keys: string[];

  static async fromEntity(
    item: OrderItemEntity,
  ) {
    const dto = new OrderItemDto();

    dto.game = SummaryGameDto.fromEntity(await item.game);
    dto.quantity = item.quantity;
    dto.unitPrice = item.unitPrice;
    dto.keys = (await item.order).status === OrderStatus.COMPLETED ? (await item.stocks).map(stock => stock.productKey) : [];

    return dto;
  }
}

const _assertExact: ExactData<OrderItem, OrderItemDto> = true;
