import { PartialType } from '@nestjs/swagger';
import { CreatePublisherDto } from './create-publisher.dto';
import { ExactData, UpdatePublisher } from '@unlockit/shared';

export class UpdatePublisherDto
  extends PartialType(CreatePublisherDto)
  implements UpdatePublisher {}

const _assertExact: ExactData<UpdatePublisher, UpdatePublisherDto> = true;
