import {
  ExactData,
  GameEntity,
  OrderItem,
  OrderStatus,
} from '@unlockit/shared';
import { OrderItemEntity } from '../entities/order-item.entity';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class OrderItemDto implements OrderItem {
  game: SummaryGameDto;
  quantity: number;
  unitPrice: number;
  keys: string[];

  static from(item: OrderItemEntity, game: GameEntity, keys: string[]) {
    const dto = new OrderItemDto();

    dto.game = SummaryGameDto.fromEntity(game);
    dto.quantity = item.quantity;
    dto.unitPrice = item.unitPrice;
    dto.keys = keys;

    return dto;
  }
}

const _assertExact: ExactData<OrderItem, OrderItemDto> = true;
