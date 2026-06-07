import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const PublisherEntityDoc = {
  Id: () =>
    applyDecorators(
      ApiProperty({
        title: 'Publisher ID',
        type: Number,
        example: 1,
        readOnly: true,
      }),
    ),

  Name: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Name',
        description: 'Unique publisher name.',
        type: String,
        minLength: 1,
        maxLength: 200,
        example: 'Activision',
        required: required,
      }),
    ),

  GamesCount: () =>
    applyDecorators(
      ApiProperty({
        title: 'Games count',
        description:
          'Number of games this publisher has released. Maintained by a DB trigger.',
        type: Number,
        minimum: 0,
        example: 15,
        readOnly: true,
        default: 0,
      }),
    ),
};
