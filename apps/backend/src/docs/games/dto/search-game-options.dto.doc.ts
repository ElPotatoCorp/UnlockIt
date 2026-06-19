import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { GameType } from '@unlockit/shared';

export const SearchGameOptionsDtoDoc = {
  Name: () =>
    applyDecorators(
      ApiProperty({
        title: 'Name',
        description:
          'Game name to search for. Automatically slugified before matching (e.g. "Call of Duty" &rarr; "call-of-duty").',
        type: String,
        example: 'call-of-duty',
        required: false,
      }),
    ),

  Type: () =>
    applyDecorators(
      ApiProperty({
        title: 'Type',
        description: 'Filter by game type.',
        enum: GameType,
        enumName: 'GameType',
        example: GameType.GAME,
        required: false,
      }),
    ),

  Price: () =>
    applyDecorators(
      ApiProperty({
        title: 'Price range',
        description:
          'Filter games by price range. `min` is required; `max` is optional. Both must be non-negative integers and `max` must be &ge; `min`.',
        type: 'object',
        required: ['min'],
        properties: {
          min: {
            type: 'integer',
            minimum: 0,
            example: 0,
            description: 'Minimum price in euros (inclusive).',
          },
          max: {
            type: 'integer',
            minimum: 0,
            example: 60,
            description:
              'Maximum price in euros (inclusive). Must be &ge; min.',
          },
        },
      }),
    ),

  Release: () =>
    applyDecorators(
      ApiProperty({
        title: 'Release filter',
        description:
          'Filter games by release date. `when` controls the comparison direction; `date` is the reference date (ISO 8601). Omit `date` when using `coming-soon`.',
        type: 'object',
        selfRequired: false,
        properties: {
          when: {
            type: 'string',
            enum: ['exact', 'before', 'after', 'coming-soon'],
            example: 'after',
            description: 'Comparison mode for the release date.',
          },
          date: {
            type: 'string',
            format: 'date',
            example: '2024-01-01',
            description: 'Reference date (ISO 8601). Not used for coming-soon.',
          },
        },
      }),
    ),

  Order: () =>
    applyDecorators(
      ApiProperty({
        title: 'Sort order',
        description: 'Controls how results are sorted.',
        type: 'object',
        selfRequired: true,
        required: ['by'],
        properties: {
          by: {
            type: 'string',
            enum: ['popular', 'price'],
            example: 'popular',
            description: 'Field to sort by.',
          },
          asc: {
            type: 'boolean',
            example: true,
            description:
              'Sort direction. `true` for ascending, `false` for descending.',
          },
        },
      }),
    ),
};
