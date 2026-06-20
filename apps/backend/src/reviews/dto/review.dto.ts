import { ExactData, Review } from "@unlockit/shared";
import { ReviewEntityDoc } from "src/docs/reviews/entities/review.entity.doc";

export class ReviewDto implements Review {
  @ReviewEntityDoc.Id()
  id: string;

  @ReviewEntityDoc.UserId(false)
  userId: string;
  @ReviewEntityDoc.GameId(false)
  gameId: number;

  @ReviewEntityDoc.Content()
  content: string;
  @ReviewEntityDoc.Rate()
  rate: number;

  @ReviewEntityDoc.HelpfulCount()
  helpfulCount: number;
  @ReviewEntityDoc.UnhelpfulCount()
  unhelpfulCount: number;

  @ReviewEntityDoc.LastEdited()
  lastEdited: Date | null;
}

const _assertExact: ExactData<Review, ReviewDto> = true;
