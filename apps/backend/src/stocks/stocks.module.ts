import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from './entities/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity])],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
