import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { EntityExistsPipe } from 'src/common/pipes/entity.pipe';
import { GameEntity } from 'src/games/entities/game.entity';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll(
    @User('sub') userId: string,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.wishlistService.findAll(userId, pagination);
  }

  @Get(':id')
  isInWishlist(
    @User('sub') userId: string,
    @Param('id', EntityExistsPipe(GameEntity)) gameId: number,
  ) {
    return { wishlisted: this.wishlistService.isInWishlist(userId, gameId) };
  }

  @Post(':id')
  add(
    @User('sub') userId: string,
    @Param('id', EntityExistsPipe(GameEntity)) gameId: number,
  ) {
    return this.wishlistService.add(userId, gameId);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @User('sub') userId: string,
    @Param('id', EntityExistsPipe(GameEntity)) gameId: number,
  ) {
    return this.wishlistService.remove(userId, gameId);
  }
}
