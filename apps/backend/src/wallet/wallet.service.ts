import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletTransactionType } from '@unlockit/shared';
import { WalletTransactionEntity } from './entities/wallet-transaction.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { TopUpWalletDto } from './dto/top-up-wallet.dto';
import { WalletBalanceDto } from './dto/wallet-balance.dto';
import { WalletTransactionDto } from './dto/wallet-transaction.dto';
import { WalletMapper } from './wallet.mapper';

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

    return { balance: parseFloat(row?.balance ?? '0') };
  }

  getTransactions(userId: string, paginationQuery: PaginationQueryDto) {
    return this.commonService.pagination.getPaginatedResponse(
      this.walletTransactionRepository,
      paginationQuery,
      {
        where: { userId },
        order: { createdAt: 'DESC' },
        transform: { fn: WalletMapper.toWalletTransaction },
      },
    );
  }

  async topUp(userId: string, dto: TopUpWalletDto): Promise<WalletBalanceDto> {
    const walletTransaction = this.walletTransactionRepository.create({
      userId,
      amount: dto.amount,
      type: WalletTransactionType.TOP_UP,
    });
    await this.walletTransactionRepository.save(walletTransaction);

    return this.getBalance(userId);
  }
}
