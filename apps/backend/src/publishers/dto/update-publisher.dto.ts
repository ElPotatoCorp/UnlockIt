import { PartialType } from '@nestjs/swagger';
import { CreatePublisherDto } from './create-publisher.dto';
import { UpdatePublisher } from '@unlockit/shared';

export class UpdatePublisherDto
  extends PartialType(CreatePublisherDto)
  implements UpdatePublisher {}
