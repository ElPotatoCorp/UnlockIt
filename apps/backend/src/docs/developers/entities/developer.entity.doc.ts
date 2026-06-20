import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { MakeDoc } from 'src/docs/common/make-doc';

export const DeveloperEntityDoc = {
  Id: MakeDoc.MakeSerial('Developer ID'),

  Name: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Name',
        description: 'Unique developer studio name.',
        type: String,
        minLength: 1,
        maxLength: 200,
        example: 'Treyarch',
        required: required,
      }),
    ),

  GamesCount: () =>
    applyDecorators(
      ApiProperty({
        title: 'Games count',
        description:
          'Number of games this developer has worked on. Maintained by a DB trigger.',
        type: Number,
        minimum: 0,
        example: 7,
        readOnly: true,
        default: 0,
      }),
    ),
};
