import { ExactData, ReviewVoteEntity as IReviewVoteEntity, UserEntity } from "@unlockit/shared";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ReviewEntity } from "./review.entity";

@Entity('review_votes')
export class ReviewVoteEntity implements IReviewVoteEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @PrimaryColumn('int', { name: 'game_id' })
  gameId: number;

  @Column('boolean', { nullable: true })
  helpful: boolean | null;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => ReviewEntity)
  @JoinColumn([
    { name: 'user_id', referencedColumnName: 'userId' },
    { name: 'game_id', referencedColumnName: 'gameId' },
  ])
  review: ReviewEntity;
}

const _assertExact: ExactData<IReviewVoteEntity, ReviewVoteEntity> = true;