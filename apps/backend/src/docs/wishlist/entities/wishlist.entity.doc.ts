import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { GamePrimitiveEntityDoc } from 'src/docs/games/entities/game-primitive.entity.doc';
import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';

export const WishlistEntityDoc = {
  UserId: UserEntityDoc.Id,

  GameId: GamePrimitiveEntityDoc.Id,

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
