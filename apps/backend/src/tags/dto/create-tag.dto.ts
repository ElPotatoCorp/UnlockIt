import { CreateTag } from '@unlockit/shared';
import { IsString, Length } from 'class-validator';
import { TagEntityDoc } from 'src/docs/tags/entities/tag.entity.doc';

export class CreateTagDto implements CreateTag {
  @TagEntityDoc.Name()
  @IsString() @Length(1, 150)
  name: string;
}
