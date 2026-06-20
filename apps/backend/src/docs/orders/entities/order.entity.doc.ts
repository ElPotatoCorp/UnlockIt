import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@unlockit/shared';
import { MakeDoc } from 'src/docs/common/make-doc';
import { GamePrimitiveEntityDoc } from 'src/docs/games/entities/game-primitive.entity.doc';
import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';

export const OrderEntityDoc = {
  // -------------------------------------------------------
  // Order (core)
  // -------------------------------------------------------

  Id: MakeDoc.MakeUUID('Order ID'),

  UserId: UserEntityDoc.Id,

  Status: () =>
    applyDecorators(
      ApiProperty({
        title: 'Order status',
        description: 'Current lifecycle status of the order.',
        enum: OrderStatus,
        example: OrderStatus.COMPLETED,
        readOnly: true,
      }),
    ),

  AmountPaidWallet: () =>
    applyDecorators(
      ApiProperty({
        title: 'Amount paid via wallet',
        description: 'Portion of the order total covered by wallet balance.',
        type: Number,
        format: 'decimal',
        example: 9.99,
        readOnly: true,
      }),
    ),

  AmountPaidStripe: () =>
    applyDecorators(
      ApiProperty({
        title: 'Amount paid via Stripe',
        description: 'Portion of the order total charged via Stripe.',
        type: Number,
        format: 'decimal',
        example: 0,
        readOnly: true,
      }),
    ),

  CreatedAt: () =>
    applyDecorators(
      ApiProperty({
        title: 'Order creation date',
        description:
          'Set automatically when the order is created and its stock is reserved.',
        type: String,
        format: 'date-time',
        example: '2024-01-15T10:23:00Z',
        readOnly: true,
      }),
    ),

  CompletedAt: () =>
    applyDecorators(
      ApiProperty({
        title: 'Order completion date',
        description:
          'Set automatically once payment is confirmed and stock is allocated. Null while the order is still pending.',
        type: String,
        format: 'date-time',
        example: '2024-01-15T10:24:12Z',
        nullable: true,
        readOnly: true,
      }),
    ),

  // -------------------------------------------------------
  // OrderItem
  // -------------------------------------------------------

  GameId: GamePrimitiveEntityDoc.Id,

  Quantity: () =>
    applyDecorators(
      ApiProperty({
        title: 'Quantity',
        description: 'Number of copies of this game purchased in the order.',
        type: Number,
        minimum: 1,
        example: 1,
      }),
    ),

  UnitPrice: () =>
    applyDecorators(
      ApiProperty({
        title: 'Unit price',
        description:
          'Price per unit at the time the order was placed. Frozen at purchase time, independent of later changes to the game price.',
        type: Number,
        format: 'decimal',
        example: 19.99,
        readOnly: true,
      }),
    ),
};