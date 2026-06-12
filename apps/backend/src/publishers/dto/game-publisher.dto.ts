import { ExactData, GamePublisher } from '@unlockit/shared';
import { PublisherEntity as PublisherEntity } from '../entities/publisher.entity';
import { PublisherEntityDoc } from 'src/docs/publishers/entities/publisher.entity.doc';

export class GamePublisherDto implements GamePublisher {
  @PublisherEntityDoc.Id()
  id: number;

  @PublisherEntityDoc.Name()
  name: string;

  static fromEntity(publisher: PublisherEntity): GamePublisherDto {
    const dto = new GamePublisherDto();

    dto.id = publisher.id;
    dto.name = publisher.name;

    return dto;
  }
}

const _assertExact: ExactData<GamePublisher, GamePublisherDto> = true;
