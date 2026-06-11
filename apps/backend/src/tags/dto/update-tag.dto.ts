import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { ExactData, UpdateTag } from '@unlockit/shared';

export class UpdateTagDto
  extends PartialType(CreateTagDto)
  implements UpdateTag {}

const _assertExact: ExactData<UpdateTag, UpdateTagDto> = true;
