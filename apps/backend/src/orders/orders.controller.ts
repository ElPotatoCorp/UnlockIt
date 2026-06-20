import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { OrdersControllerDoc } from 'src/docs/orders/orders.controller.doc';

@OrdersControllerDoc.Controller()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @OrdersControllerDoc.FindAll()
  @Get()
  findAll(
    @User('sub') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.ordersService.findAll(userId, paginationQuery);
  }

  @OrdersControllerDoc.FindOne()
  @Get(':id')
  findOne(
    @User('sub') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) orderId: string,
  ) {
    return this.ordersService.findOne(orderId, userId);
  }
}
