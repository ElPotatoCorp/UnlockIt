import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { IsNull, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ReviewVoteEntity } from './entities/review-vote.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReviewVoteDto } from './dto/review-vote.dto';
import { ReviewMapper } from './review.mapper';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(ReviewVoteEntity)
    private readonly reviewVoteRepository: Repository<ReviewVoteEntity>,
    private readonly commonService: CommonService,
  ) {}

  create(userId: string, gameId: number, createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create({ userId, gameId, ...createReviewDto });
    return this.reviewRepository.save(review);
  }

  findAll(gameId: number, paginationQueryDto: PaginationQueryDto) {
    return this.commonService.pagination.getPaginatedResponse(
      this.reviewRepository,
      paginationQueryDto,
      {
        where: { gameId },
        transform: { fn: ReviewMapper.toReview },
      },
    );
  }

  findOne(userId: string, gameId: number) {
    return this.commonService.entities.fetchEntityOrFail(
      this.reviewRepository,
      { where: { userId, gameId } },
    );
  }

  async vote(userId: string, gameId: number, reviewVoteDto: ReviewVoteDto) {
    const vote = this.reviewVoteRepository.create({ 
      userId,
      gameId,
      ...reviewVoteDto
    });

    return this.reviewVoteRepository.save(vote);
  }

  update(userId: string, gameId: number, updateReviewDto: UpdateReviewDto) {
    return this.reviewRepository.update({ userId, gameId }, { ...updateReviewDto, lastEdited: new Date() });
  }

  remove(userId: string, gameId: number) {
    return this.reviewRepository.delete({ userId, gameId });
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  private _removeCancelledVotes() {
    this.reviewVoteRepository.delete({ helpful: IsNull() })
  }
}
