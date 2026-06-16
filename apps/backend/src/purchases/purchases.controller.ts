import { Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  findAll(
    @User('sub') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.purchasesService.findAll(userId, paginationQuery);
  }

  @Get(':orderId/:gameId')
  findOne(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.purchasesService.findOne(userId, orderId, gameId);
  }

  @Get(':orderId/:gameId/keys')
  findKeys(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.purchasesService.findKeys(userId, orderId, gameId);
  }
}
