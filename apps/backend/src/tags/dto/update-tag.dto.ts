import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { UpdateTag } from '@unlockit/shared';

export class UpdateTagDto extends PartialType(CreateTagDto) implements UpdateTag {}