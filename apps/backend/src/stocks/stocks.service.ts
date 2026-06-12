import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  async create(gameId: number, createStockDto: CreateStockDto) {
    const productKeys = createStockDto.productKeys;
    const productKeySet = new Set<string>();
    const duplicatedKeys = new Set<string>();

    for (const productKey of productKeys) {
      if (productKeySet.has(productKey)) {
        duplicatedKeys.add(productKey);
      } else {
        productKeySet.add(productKey);
      }
    }

    if (duplicatedKeys.size > 0) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'Unprocessable Entity',
        message: 'There are duplicated values in the payload',
        duplicatedValues: Array.from(duplicatedKeys),
      });
    }

    this.stockRepository.create(
      productKeys.map(productKey => ({ productKey, gameId })),
    );
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
