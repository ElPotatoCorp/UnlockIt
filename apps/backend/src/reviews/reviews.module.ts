import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ReviewVoteEntity } from './entities/review-vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, ReviewVoteEntity])],
  providers: [ReviewsService],
  exports: [ReviewsService, TypeOrmModule]
})
export class ReviewsModule {}
