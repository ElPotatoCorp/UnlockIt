import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { TopUpWalletDto } from './dto/top-up-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  getBalance(@User('sub') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Get('transactions')
  getTransactions(
    @User('sub') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.walletService.getTransactions(userId, paginationQuery);
  }

  @Post('top-up')
  topUp(@User('sub') userId: string, @Body() dto: TopUpWalletDto) {
    return this.walletService.topUp(userId, dto);
  }
}
