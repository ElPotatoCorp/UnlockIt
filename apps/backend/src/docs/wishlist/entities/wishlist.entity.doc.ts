import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const WishlistEntityDoc = {
  UserId: () =>
    applyDecorators(
      ApiProperty({
        title: 'User ID',
        description: 'The UUID of the user who added the game to their wishlist.',
        type: String,
        format: 'uuid',
        example: '08dbd076-c3d8-46d4-bb0d-ebedc8bebd1f',
        readOnly: true,
      }),
    ),

  GameId: () =>
    applyDecorators(
      ApiProperty({
        title: 'Game ID',
        description: 'The ID of the wishlisted game.',
        type: Number,
        example: 42,
        readOnly: true,
      }),
    ),

  AddedAt: () =>
    applyDecorators(
      ApiProperty({
        title: 'Date added',
        description: 'Timestamp of when the game was added to the wishlist.',
        type: String,
        format: 'date-time',
        example: '2024-03-21T15:30:00Z',
        readOnly: true,
      }),
    ),
};