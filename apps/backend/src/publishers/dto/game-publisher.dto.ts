import { ExactData, GamePublisher } from '@unlockit/shared';
import { PublisherEntity as PublisherEntity } from '../entities/publisher.entity';

export class GamePublisherDto implements GamePublisher {
  id: number;
  name: string;

  static fromEntity(publisher: PublisherEntity): GamePublisherDto {
    const dto = new GamePublisherDto();

    dto.id = publisher.id;
    dto.name = publisher.name;

    return dto;
  }
}

const _assertExact: ExactData<GamePublisher, GamePublisherDto> = true;