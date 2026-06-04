import { CreateDeveloper } from '@unlockit/shared';
import { IsString, Length } from 'class-validator';
import { DeveloperEntityDoc } from 'src/docs/developers/entities/developer.entity.doc';

export class CreateDeveloperDto implements CreateDeveloper {
  @DeveloperEntityDoc.Name()
  @IsString() @Length(1, 200)
  name: string;
}