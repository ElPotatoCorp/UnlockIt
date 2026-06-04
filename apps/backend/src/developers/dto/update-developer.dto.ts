import { PartialType } from '@nestjs/swagger';
import { CreateDeveloperDto } from './create-developer.dto';
import { UpdateDeveloper } from '@unlockit/shared';

export class UpdateDeveloperDto extends PartialType(CreateDeveloperDto) implements UpdateDeveloper {}
