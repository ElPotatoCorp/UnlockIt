import { CreatePublisher } from '@unlockit/shared';
import { IsString, Length } from 'class-validator';
import { PublisherEntityDoc } from 'src/docs/publishers/entities/publisher.entity.doc';

export class CreatePublisherDto implements CreatePublisher {
  @PublisherEntityDoc.Name()
  @IsString()
  @Length(1, 200)
  name: string;
}
