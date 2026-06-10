import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { MinRole } from 'src/employees/decorators/support-roles.decorator';
import { EmployeeRole } from '@unlockit/shared';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { StockEntity } from './entities/stock.entity';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';
import { StockDto } from './dto/stock.dto';

@Controller('stocks')
@MinRole(EmployeeRole.SUPER_ADMIN)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createStockDto: CreateStockDto) {
    return this.stocksService.create(+id, createStockDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.stocksService.findAll(+id, paginationQueryDto);
  }

  @Get(':id/one')
  findOne(@Param('id', EntityExistsPipe(StockEntity, 'gameId')) stock: StockEntity) {
    return StockDto.fromEntities([stock]);
  }

  @Delete(':id')
  softRemove(@Param('id', EntityExistsPipe(StockEntity)) stock: StockEntity) {
    return this.stocksService.softRemove(stock);
  }
}
