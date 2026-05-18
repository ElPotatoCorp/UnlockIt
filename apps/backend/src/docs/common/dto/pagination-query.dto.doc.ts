import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export const PaginationQueryDtoDoc = {
  Page: () => applyDecorators(
    ApiProperty({
      title: 'Page',
      description: 'Current page number. Should be at least 1.',
      type: Number,
      example: 1,
      minimum: 1,
      default: 1,
      required: false,
    })
  ),
  
  Limit: () => applyDecorators(
    ApiProperty({
      title: 'Limit',
      description: 'Maximum number of items returned per page. Should be between 1 and 100.',
      type: Number,
      example: 20,
      minimum: 1,
      maximum: 100,
      default: 20,
      required: false,
    })
  ),
}