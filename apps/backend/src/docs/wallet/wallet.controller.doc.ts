import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { PaginatedDtoSchemaDoc } from 'src/docs/common/dto/paginated.dto.doc';
import { WalletBalanceDto } from 'src/wallet/dto/wallet-balance.dto';
import { WalletTransactionDto } from 'src/wallet/dto/wallet-transaction.dto';
import { TopUpWalletDto } from 'src/wallet/dto/top-up-wallet.dto';

export const WalletControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Wallet'), ApiAuth()),

  // GET /wallet
  GetBalance: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get wallet balance',
        description: "Returns the authenticated user's current wallet balance.",
      }),
      ApiOkResponse({ description: 'Current balance.', type: WalletBalanceDto }),
    ),

  // GET /wallet/transactions
  GetTransactions: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List wallet transactions',
        description:
          "Returns a paginated list of the authenticated user's wallet transactions (top-ups and purchase debits).",
      }),
      ApiExtraModels(PaginatedDto, WalletTransactionDto),
      ApiOkResponse({
        description: 'Paginated list of wallet transactions.',
        schema: PaginatedDtoSchemaDoc(WalletTransactionDto),
      }),
      ApiBadRequestResponse({ description: 'Invalid pagination parameters.' }),
    ),

  // POST /wallet/top-up
  TopUp: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Top up wallet balance (development only)',
        description:
          'Directly credits the wallet for the given amount with no real payment behind it. This exists only because Stripe is not yet integrated, and is not safe to expose once it is — any authenticated user can currently mint arbitrary balance by calling this with any amount.',
      }),
      ApiBody({ type: TopUpWalletDto }),
      ApiCreatedResponse({
        description: 'Wallet credited.',
        type: WalletBalanceDto,
      }),
      ApiBadRequestResponse({
        description:
          'amount must be a positive number with at most 2 decimal places.',
      }),
    ),
};