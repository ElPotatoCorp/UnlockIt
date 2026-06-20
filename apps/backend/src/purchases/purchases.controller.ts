import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';

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

  // --- Reviews ---
  @Post(':orderId/:gameId/review')
  async addReview(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    await this.purchasesService.addReview(userId, orderId, gameId, createReviewDto);
  }

  @Patch(':orderId/:gameId/review')
  async updateReview(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    await this.purchasesService.updateReview(userId, orderId, gameId, updateReviewDto);
  }

  @Delete(':orderId/:gameId/review')
  async removeReview(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    await this.purchasesService.removeReview(userId, orderId, gameId);
  }
}
