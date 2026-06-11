import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockEntity } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { StockDto } from './dto/stock.dto';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    private readonly commonService: CommonService,
  ) {}

  create(gameId: number, createStockDto: CreateStockDto) {
    const stocks = this.stockRepository.create(
      createStockDto.productKeys.map((productKey) => {
        return { productKey: productKey, gameId };
      }),
    );
    return this.stockRepository.save(stocks);
  }

  findAll(id: number, paginationQueryDto: PaginationQueryDto) {
    return this.commonService.getPaginatedResponse(
      this.stockRepository,
      paginationQueryDto,
      {
        where: { gameId: id },
        transform: { fn: StockDto.fromEntities, each: false },
      },
    );
  }

  softRemove(stock: StockEntity) {
    return this.stockRepository.softRemove(stock);
  }
}
