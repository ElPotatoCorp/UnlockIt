import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ReviewVoteEntity } from './entities/review-vote.entity';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, ReviewVoteEntity])],
  providers: [ReviewsService],
  exports: [ReviewsService, TypeOrmModule],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
