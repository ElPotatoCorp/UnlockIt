import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { In, IsNull, Repository } from 'typeorm';
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

  async findAll(gameId: number, paginationQueryDto: PaginationQueryDto, userId?: string) {
    const res = await this.commonService.pagination.getPaginatedResponse(
      this.reviewRepository,
      paginationQueryDto,
      {
        where: { gameId },
        transform: { fn: ReviewMapper.toReview },
      },
    );

    if (userId) {
      const reviewIds = res.data.map(review => review.id);
      const voted = await this.getUserVotes(userId, reviewIds);
      const votedSet = new Set(voted.map(v => v.reviewId));

      res.data.map(review => ({
        ...review,
        ...(votedSet.has(review.id) ? { voted: voted.find(vote => vote.reviewId === review.id)!.helpful } : { })
      }))
    }

    return res;
  }

  findOne(userId: string, gameId: number) {
    return this.commonService.entities.fetchEntityOrFail(
      this.reviewRepository,
      { where: { userId, gameId } },
    );
  }

  async vote(userId: string, review: ReviewEntity, reviewVoteDto: ReviewVoteDto) {
    if (review.userId === userId)
      throw new ForbiddenException('You cannot vote for your own review')

    const { helpful } = reviewVoteDto;
    let vote = await this.reviewVoteRepository.findOneBy({ reviewId: review.id, userId });


    if (!vote) {
      vote = this.reviewVoteRepository.create({ 
        reviewId: review.id,
        userId,
      });
    }

    if (vote.helpful === helpful)
      return vote;

    const newCounts = {
      helpfulCount: review.helpfulCount,
      unHelpfulCount: review.unHelpfulCount,
    }
    if (vote.helpful === null) {
      if (helpful === true)
        newCounts.helpfulCount += 1;
      else
        newCounts.unHelpfulCount += 1;
    } else if (vote.helpful === false) {
      newCounts.unHelpfulCount -= 1;
      if (helpful === true)
        newCounts.helpfulCount += 1;
    } else {
      newCounts.helpfulCount -= 1;
      if (helpful === false)
        newCounts.unHelpfulCount += 1;
    }

    vote.helpful = helpful;

    return this.reviewVoteRepository.save(vote).then(async value => {
      await this.reviewRepository.update(review.id, { ...newCounts });
      return value;
    });
  }

  async getUserVotes(userId: string, reviewIds: string[]) {
    const votes = await this.reviewVoteRepository.find({ where: {
      userId,
      reviewId: In(reviewIds),
    }});

    return votes.map(vote => ({ reviewId: vote.reviewId, helpful: vote.helpful }));
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
