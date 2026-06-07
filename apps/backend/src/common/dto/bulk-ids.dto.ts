import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BulkIdsDto {
  @ApiProperty({
    description: 'Array of numeric IDs.',
    type: Number,
    isArray: true,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids: number[];
}
