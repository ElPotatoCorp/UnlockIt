import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const TagEntityDoc = {
  Id: () =>
    applyDecorators(
      ApiProperty({
        title: 'Tag ID',
        type: Number,
        example: 1,
        readOnly: true,
      }),
    ),

  Name: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Name',
        description: 'Unique tag label.',
        type: String,
        minLength: 1,
        maxLength: 150,
        example: 'Multiplayer',
        required: required,
      }),
    ),

  GamesCount: () =>
    applyDecorators(
      ApiProperty({
        title: 'Games count',
        description:
          'Number of games associated with this tag. Maintained by a DB trigger.',
        type: Number,
        minimum: 0,
        example: 42,
        readOnly: true,
        default: 0,
      }),
    ),
};
