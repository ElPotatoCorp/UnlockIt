import { PublisherEntity as PublisherEntity } from '../entities/publisher.entity';

export class GamePublisherDto implements GamePublisherDto {
  id: number;
  name: string;

  static fromEntity(publisher: PublisherEntity): GamePublisherDto {
    const dto = new GamePublisherDto();

    dto.id = publisher.id;
    dto.name = publisher.name;

    return dto;
  }
}
