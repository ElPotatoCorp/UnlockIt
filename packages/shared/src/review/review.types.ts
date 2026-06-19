import { GameEntity } from "../game/game.types";
import { UserEntity } from "../user/user.types";

export type ReviewEntity = {
  id: string;

  userId: string;
  user: UserEntity;

  gameId: number;
  game: GameEntity;

  content: string;
  rate: number;

  helpfulCount: number;
  unhelpfulCount: number;

  lastEdited: Date | null;
}

export type ReviewVoteEntity = {
  reviewId: string;
  review: ReviewEntity;

  userId: string;
  user: UserEntity

  helpful: boolean | null;
}

export type Review = Omit<ReviewEntity, 'user' | 'game'>;

export type CreateReview = Pick<ReviewEntity, 'content' | 'rate'>;

export type UpdateReview = Partial<CreateReview>;

export type ReviewVote = Pick<ReviewVoteEntity, 'helpful'>;