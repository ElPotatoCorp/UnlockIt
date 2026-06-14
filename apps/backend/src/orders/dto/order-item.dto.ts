import { ExactData, OrderItem } from '@unlockit/shared';
import { OrderItemEntity } from '../entities/order-item.entity';
import { GameEntity } from 'src/games/entities/game.entity';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export class OrderItemDto implements OrderItem {
  game: SummaryGameDto;
  quantity: number;
  unitPrice: number;
  keys: string[];

  static fromEntity(
    item: OrderItemEntity,
    game: GameEntity,
    keys: string[],
  ): OrderItemDto {
    const dto = new OrderItemDto();

    dto.game = SummaryGameDto.fromEntity(game);
    dto.quantity = item.quantity;
    dto.unitPrice = item.unitPrice;
    dto.keys = keys;

    return dto;
  }
}

const _assertExact: ExactData<OrderItem, OrderItemDto> = true;
