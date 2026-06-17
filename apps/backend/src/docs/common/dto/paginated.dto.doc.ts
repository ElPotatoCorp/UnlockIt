import { applyDecorators } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';

export const PaginatedDtoSchemaDoc = (itemType: any) => ({
  allOf: [
    { $ref: getSchemaPath(PaginatedDto) },
    {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(itemType) },
        },
      },
    },
  ],
});

export const PaginatedDtoDoc = {
  Total: () =>
    applyDecorators(
      ApiProperty({
        title: 'Total',
        description:
          'Total number of items matching the query across all pages.',
        type: Number,
        example: 42,
        minimum: 0,
      }),
    ),

  Page: () =>
    applyDecorators(
      ApiProperty({
        title: 'Page',
        description: 'Current page number.',
        type: Number,
        example: 1,
        minimum: 1,
      }),
    ),

  Limit: () =>
    applyDecorators(
      ApiProperty({
        title: 'Limit',
        description: 'Maximum number of items returned per page.',
        type: Number,
        example: 10,
        minimum: 1,
      }),
    ),

  Data: () =>
    applyDecorators(
      ApiProperty({
        title: 'Data',
        description: 'List of items for the current page.',
        type: 'array',
        items: {
          type: 'object',
        },
      }),
    ),
};
