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
  ParseBoolPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { GameEntity } from 'src/games/entities/game.entity';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { EntityExistsPipe } from 'src/common/entities/pipes/entity-exists.pipe';
import { CartControllerDoc } from 'src/docs/carts/cart.controller.doc';

@CartControllerDoc.Controller()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @CartControllerDoc.Get()
  @Get()
  get(@User('cartId') cartId: string, @Query() pagination: PaginationQueryDto) {
    return this.cartService.get(cartId, pagination);
  }

  @CartControllerDoc.Total()
  @Get('total')
  async total(@User('cartId') cartId: string) {
    return { total: await this.cartService.total(cartId) };
  }

  @CartControllerDoc.Toggle()
  @Post(':id/toggle')
  @HttpCode(HttpStatus.NO_CONTENT)
  toggle(
    @User('cartId') cartId: string,
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Query('state', new ParseBoolPipe({ optional: true })) state?: boolean,
  ) {
    return this.cartService.toggle(cartId, gameId, state);
  }

  @CartControllerDoc.Add()
  @Post(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  add(
    @User('cartId') cartId: string,
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Query('quantity', new ParseIntPipe({ optional: true })) quantity?: number,
  ) {
    return this.cartService.add(cartId, gameId, quantity);
  }

  @CartControllerDoc.Remove()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @User('cartId') cartId: string,
    @Param('id', ParseIntPipe, EntityExistsPipe(GameEntity)) gameId: number,
    @Query('quantity', new ParseIntPipe({ optional: true })) quantity?: number,
  ) {
    return this.cartService.remove(cartId, gameId, quantity);
  }

  @CartControllerDoc.Clear()
  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  clear(@User('cartId') cartId: string) {
    return this.cartService.clear(cartId);
  }
}
