import { ExactData, Review } from "@unlockit/shared";

export class ReviewDto implements Review {
  id: string;

  userId: string;
  gameId: number;

  content: string;
  rate: number;

  helpfulCount: number;
  unhelpfulCount: number;

  lastEdited: Date | null;
}

const _assertExact: ExactData<Review, ReviewDto> = true;
