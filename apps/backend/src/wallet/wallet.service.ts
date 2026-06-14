import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletTransactionType } from '@unlockit/shared';
import { WalletTransactionEntity } from './entities/wallet-transaction.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TopUpWalletDto } from './dto/top-up-wallet.dto';
import { WalletBalanceDto } from './dto/wallet-balance.dto';
import { WalletTransactionDto } from './dto/wallet-transaction.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletTransactionEntity)
    private readonly walletTransactionRepository: Repository<WalletTransactionEntity>,
    private readonly commonService: CommonService,
  ) {}

  async getBalance(userId: string): Promise<WalletBalanceDto> {
    const row = await this.walletTransactionRepository
      .createQueryBuilder('wt')
      .select('COALESCE(SUM(wt.amount), 0)', 'balance')
      .where('wt.userId = :userId', { userId })
      .getRawOne<{ balance: string }>();

    const dto = new WalletBalanceDto();
    dto.balance = parseFloat(row?.balance ?? '0');
    return dto;
  }

  getTransactions(userId: string, paginationQuery: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.walletTransactionRepository,
      paginationQuery,
      {
        where: { userId },
        order: { createdAt: 'DESC' as const },
        transform: { fn: WalletTransactionDto.fromEntities, each: false },
      },
    );
  }

  async topUp(userId: string, dto: TopUpWalletDto): Promise<WalletBalanceDto> {
    await this.walletTransactionRepository.insert({
      userId,
      orderId: null,
      amount: dto.amount,
      type: WalletTransactionType.TOP_UP,
    });

    return this.getBalance(userId);
  }
}
