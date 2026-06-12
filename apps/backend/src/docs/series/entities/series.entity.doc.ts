import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { SummaryGameDto } from 'src/games/dto/summary-game.dto';

export const SeriesEntityDoc = {
  Id: () =>
    applyDecorators(
      ApiProperty({
        title: 'Series ID',
        description: 'Unique identifier, auto-incremented by the system.',
        type: Number,
        example: 1,
        readOnly: true,
      }),
    ),

  Name: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Name',
        description: 'Display name of the series.',
        type: String,
        minLength: 3,
        maxLength: 255,
        example: 'Call of Duty: Black Ops',
        required: required,
      }),
    ),

  Slug: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Slug',
        description:
          'URL-friendly unique identifier. Lowercase alphanumeric and hyphens only.',
        type: String,
        minLength: 3,
        maxLength: 255,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'call-of-duty-black-ops',
        required: required,
      }),
    ),

  Games: () =>
    applyDecorators(
      ApiProperty({
        title: 'Games',
        description: 'List of games belonging to this series.',
        type: SummaryGameDto,
        isArray: true,
        required: false,
      }),
    ),

  GameIds: (required = true) =>
    applyDecorators(
      ApiProperty({
        title: 'Game IDs',
        description:
          'List of numeric game IDs to add or remove from the series.',
        type: Number,
        isArray: true,
        example: [1, 2, 3],
        required: required,
      }),
    ),
};
