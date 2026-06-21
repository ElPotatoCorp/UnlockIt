import { ReviewVoteDto } from "./dto/review-vote.dto";
import { ReviewDto } from "./dto/review.dto";
import { ReviewVoteEntity } from "./entities/review-vote.entity";
import { ReviewEntity } from "./entities/review.entity";

export class ReviewMapper {
  static toReview(review: ReviewEntity): ReviewDto {
    const dto = new ReviewDto();

    dto.id = review.id;
    dto.userId = review.userId;
    dto.gameId = review.gameId;
    dto.content = review.content;
    dto.rate = review.rate;
    dto.helpfulCount = review.helpfulCount;
    dto.unHelpfulCount = review.unHelpfulCount;

    return dto;
  }

  static toVote(reviewVote: ReviewVoteEntity): ReviewVoteDto {
    const dto = new ReviewVoteDto();

    dto.helpful = reviewVote.helpful;

    return dto;
  }
}