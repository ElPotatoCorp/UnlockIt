import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';
import { PurchasesControllerDoc } from 'src/docs/purchases/purchases.controller.doc';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @PurchasesControllerDoc.Index()
  @Get()
  index(
    @User('sub') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.purchasesService.findAll(userId, paginationQuery);
  }

  @PurchasesControllerDoc.FindOne()
  @Get(':orderId/:gameId')
  findOne(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.purchasesService.findOne(userId, orderId, gameId);
  }

  @PurchasesControllerDoc.FindKeys()
  @Get(':orderId/:gameId/keys')
  findKeys(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.purchasesService.findKeys(userId, orderId, gameId);
  }

  // --- Reviews ---
  @PurchasesControllerDoc.AddReview()
  @Post(':orderId/:gameId/review')
  addReview(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.purchasesService.addReview(userId, orderId, gameId, createReviewDto);
  }

  @PurchasesControllerDoc.UpdateReview()
  @Patch(':orderId/:gameId/review')
  updateReview(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.purchasesService.updateReview(userId, orderId, gameId, updateReviewDto);
  }

  @PurchasesControllerDoc.RemoveReview()
  @Delete(':orderId/:gameId/review')
  removeReview(
    @User('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.purchasesService.removeReview(userId, orderId, gameId);
  }
}
