import { ReviewDto } from "./dto/review.dto";
import { ReviewEntity } from "./entities/review.entity";

export class ReviewMapper {
  static toReview(review: ReviewEntity): ReviewDto {
    const dto = new ReviewDto();

    dto.userId = review.userId;
    dto.gameId = review.gameId;
    dto.content = review.content;
    dto.rate = review.rate;
    dto.helpfulCount = review.helpfulCount;
    dto.unhelpfulCount = review.unhelpfulCount;

    return dto;
  }
}