import { GameEntity } from "../game/game.types";
import { UserEntity } from "../user/user.types";
import { Simplify } from "../utils/types";

export type ReviewEntity = {
  id: string;

  userId: string;
  user: UserEntity;

  gameId: number;
  game: GameEntity;

  content: string;
  rate: number;

  helpfulCount: number;
  unHelpfulCount: number;

  lastEdited: Date | null;
}

export type ReviewVoteEntity = {
  reviewId: string;
  review: ReviewEntity;

  userId: string;
  user: UserEntity

  helpful: boolean | null;
}

export type Review = Simplify<Omit<ReviewEntity, 'user' | 'game'> & { voted?: boolean | null }>;

export type CreateReview = Pick<ReviewEntity, 'content' | 'rate'>;

export type UpdateReview = Partial<CreateReview>;

export type ReviewVote = Pick<ReviewVoteEntity, 'helpful'>;