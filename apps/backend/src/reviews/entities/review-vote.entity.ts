import { ExactData, ReviewVoteEntity as IReviewVoteEntity } from "@unlockit/shared";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ReviewEntity } from "./review.entity";
import { UserEntity } from "src/user/entities/user.entity";

@Entity('review_votes')
export class ReviewVoteEntity implements IReviewVoteEntity {
  @PrimaryColumn('uuid', { name: 'review_id' })
  reviewId: string;

  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column('boolean', { nullable: true })
  helpful: boolean | null;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => ReviewEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: ReviewEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

const _assertExact: ExactData<IReviewVoteEntity, ReviewVoteEntity> = true;