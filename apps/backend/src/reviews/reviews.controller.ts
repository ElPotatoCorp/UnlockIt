import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { ReviewVoteDto } from './dto/review-vote.dto';
import { ReviewsService } from './reviews.service';
import { ReviewsControllerDoc } from 'src/docs/reviews/reviews.controller.doc';
import { ReviewMapper } from './review.mapper';
import { EntityFetchPipe } from 'src/common/entities/pipes/fetch-entity.pipe';
import { ReviewEntity } from './entities/review.entity';

@ReviewsControllerDoc.Controller()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ReviewsControllerDoc.Vote()
  @Post(':id/vote')
  @HttpCode(HttpStatus.OK)
  async vote(
    @User('sub') userId: string,
    @Param(
      'id',
      new ParseUUIDPipe({ version: '4' }),
      EntityFetchPipe(ReviewEntity),
    )
    review: ReviewEntity,
    @Body() reviewVoteDto: ReviewVoteDto,
  ) {
    return ReviewMapper.toVote(
      await this.reviewsService.vote(userId, review, reviewVoteDto),
    );
  }
}
