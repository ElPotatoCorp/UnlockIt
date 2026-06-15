import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { EntityExistsPipe } from 'src/common/pipes/entity.pipe';
import { GameEntity } from 'src/games/entities/game.entity';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  get(@User('cartId') cartId: string, @Query() pagination: PaginationQueryDto) {
    return this.cartService.get(cartId, pagination);
  }

  @Get('total')
  total(@User('cartId') cartId: string) {
    return this.cartService.total(cartId);
  }

  @Post(':id/toggle')
  toggle(
    @User('cartId') cartId: string,
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Query('state') state?: boolean,
  ) {
    return this.cartService.toggle(cartId, gameId, state);
  }

  @Post(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  add(
    @User('cartId') cartId: string,
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Query('quantity') quantity?: number,
  ) {
    return this.cartService.add(cartId, gameId, quantity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @User('cartId') cartId: string,
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Query('quantity') quantity?: number,
  ) {
    return this.cartService.remove(cartId, gameId, quantity);
  }

  @Delete('clear')
  clear(@User('cartId') cartId: string) {
    return this.cartService.clear(cartId);
  }
}
