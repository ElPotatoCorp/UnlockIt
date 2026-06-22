import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { MakeDoc } from 'src/docs/common/make-doc';
import { GamePrimitiveEntityDoc } from 'src/docs/games/entities/game-primitive.entity.doc';

export const CartItemEntityDoc = {
  CartId: MakeDoc.MakeUUID('Cart ID'),

  GameId: GamePrimitiveEntityDoc.Id,

  Quantity: () =>
    applyDecorators(
      ApiProperty({
        title: 'Quantity',
        description: 'The amount of this item.',
        type: Number,
        minimum: 1,
        default: 1,
        example: 2,
      }),
    ),

  Selected: () =>
    applyDecorators(
      ApiProperty({
        title: 'Selected',
        description: 'If the item will be purchased or not.',
        type: Boolean,
        default: true,
        example: true,
      }),
    ),

  AddedAt: () =>
    applyDecorators(
      ApiProperty({
        title: 'Date of Creation',
        description: 'When was the item added to keep it in order',
        type: Date,
        default: new Date(),
        example: new Date(),
      }),
    ),
};
