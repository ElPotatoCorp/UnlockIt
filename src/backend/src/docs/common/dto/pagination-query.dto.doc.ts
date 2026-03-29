import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export const PaginationQueryDtoDoc = {
  Page: () => applyDecorators(
    ApiProperty({
      title: 'Page',
      description: 'Current page number. Must be at least 1.',
      type: Number,
      example: 1,
      minimum: 1,
    })
  ),
  
  Limit: () => applyDecorators(
    ApiProperty({
      title: 'Limit',
      description: 'Maximum number of items returned per page. Must be between 1 and 100.',
      type: Number,
      example: 20,
      minimum: 1,
      maximum: 100,
    })
  ),
}