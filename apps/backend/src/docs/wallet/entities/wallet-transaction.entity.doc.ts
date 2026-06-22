import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { WalletTransactionType } from '@unlockit/shared';
import { MakeDoc } from 'src/docs/common/make-doc';
import { OrderEntityDoc } from 'src/docs/orders/entities/order.entity.doc';
import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';

export const WalletTransactionEntityDoc = {
  Id: MakeDoc.MakeUUID('Transaction ID'),

  UserId: UserEntityDoc.Id,

  OrderId: OrderEntityDoc.Id,

  Amount: () =>
    applyDecorators(
      ApiProperty({
        title: 'Amount',
        description:
          'Signed amount in the wallet currency. Positive for credits (e.g. top-ups), negative for debits (e.g. purchases).',
        type: Number,
        format: 'decimal',
        example: -19.99,
        readOnly: true,
      }),
    ),

  Type: () =>
    applyDecorators(
      ApiProperty({
        title: 'Transaction type',
        description: 'Reason for the wallet movement.',
        enum: WalletTransactionType,
        example: WalletTransactionType.PURCHASE,
        readOnly: true,
      }),
    ),

  CreatedAt: () =>
    applyDecorators(
      ApiProperty({
        title: 'Transaction date',
        description:
          'Set automatically by the server when the transaction is recorded.',
        type: String,
        format: 'date-time',
        example: '2024-01-15T10:23:00Z',
        readOnly: true,
      }),
    ),
};
