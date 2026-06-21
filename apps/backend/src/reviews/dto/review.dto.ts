import { ApiProperty } from "@nestjs/swagger";
import { ExactData, Review } from "@unlockit/shared";
import { ReviewEntityDoc } from "src/docs/reviews/entities/review.entity.doc";

export class ReviewDto implements Review {
  @ReviewEntityDoc.Id(false)
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
  unHelpfulCount: number;

  @ReviewEntityDoc.LastEdited()
  lastEdited: Date | null;

  @ApiProperty({
    title: 'Voted',
    description: 'If the optionally authenticated user has voted for this review',
    type: Boolean,
    nullable: true,
  })
  voted: boolean | null;
}

const _assertExact: ExactData<Review, ReviewDto> = true;
