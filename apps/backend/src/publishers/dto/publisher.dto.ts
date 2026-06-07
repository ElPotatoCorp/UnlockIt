import { Publisher } from "@unlockit/shared";
import { PublisherEntity as PublisherEntity } from "../entities/publisher.entity";

export class PublisherDto implements Publisher {
  id: number;
  name: string;

  static fromEntity(publisher: PublisherEntity) {
    const dto = new PublisherDto();

    dto.id = publisher.id;
    dto.name = publisher.name
  }
}