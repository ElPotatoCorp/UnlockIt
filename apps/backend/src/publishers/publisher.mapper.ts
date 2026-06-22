import { GamePublisherDto } from './dto/game-publisher.dto';
import { PublisherEntity } from './entities/publisher.entity';

export class PublisherMapper {
  static toGamePublisher(publisher: PublisherEntity) {
    const dto = new GamePublisherDto();

    dto.id = publisher.id;
    dto.name = publisher.name;

    return dto;
  }
}
