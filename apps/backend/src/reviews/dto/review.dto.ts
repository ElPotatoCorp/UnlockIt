import { Review } from "@unlockit/shared";

export class ReviewDto implements Review {
  userId: string;
  gameId: number;

  content: string;
  rate: number;

  helpfulCount: number;
  unhelpfulCount: number;

  lastEdited: Date | null;
}