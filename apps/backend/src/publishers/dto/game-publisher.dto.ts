import { ExactData, GamePublisher } from '@unlockit/shared';
import { PublisherEntityDoc } from 'src/docs/publishers/entities/publisher.entity.doc';

export class GamePublisherDto implements GamePublisher {
  @PublisherEntityDoc.Id()
  id: number;

  @PublisherEntityDoc.Name()
  name: string;
}

const _assertExact: ExactData<GamePublisher, GamePublisherDto> = true;
