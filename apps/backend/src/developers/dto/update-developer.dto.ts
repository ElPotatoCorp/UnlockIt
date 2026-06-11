import { PartialType } from '@nestjs/swagger';
import { CreateDeveloperDto } from './create-developer.dto';
import { ExactData, UpdateDeveloper } from '@unlockit/shared';

export class UpdateDeveloperDto
  extends PartialType(CreateDeveloperDto)
  implements UpdateDeveloper {}

const _assertExact: ExactData<UpdateDeveloper, UpdateDeveloperDto> = true;
