import { GameEntity } from "../game/game.types";
import { UserEntity } from "../user/user.types";

export type ReviewEntity = {
  userId: string;
  user: UserEntity;

  gameId: number;
  game: GameEntity;

  content: string;
  score: number;

  helpfulCount: number;
  unhelpfulCount: number;

  lastEdited: Date | null;
}

export type ReviewVoteEntity = {
  userId: string;
  gameId: number;

  helpful: boolean | null;

  review: ReviewEntity;
}

export type Review = Omit<ReviewEntity, 'user' | 'game'>;

export type CreateReview = Pick<ReviewEntity, 'content' | 'score'>;

export type UpdateReview = Partial<CreateReview>;

export type ReviewVote = Pick<ReviewVoteEntity, 'helpful'>;