import { IsString, Length } from 'class-validator';
import { DeveloperEntityDoc } from 'src/docs/developers/entities/developer.entity.doc';

export class CreateDeveloperDto {
  @DeveloperEntityDoc.Name()
  @IsString() @Length(1, 200)
  name: string;
}