import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { ReviewVoteDto } from './dto/review-vote.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post(':id/vote')
  vote(
    @User('sub') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) reviewId: string,
    @Body() reviewVoteDto: ReviewVoteDto,
  ) {
    return this.reviewsService.vote(userId, reviewId, reviewVoteDto);
  }
}
