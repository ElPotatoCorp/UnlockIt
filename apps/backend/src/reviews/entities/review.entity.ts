import { ExactData, ReviewEntity as IReviewEntity } from '@unlockit/shared';
import { ReviewEntityDoc } from 'src/docs/reviews/entities/review.entity.doc';
import { GameEntity } from 'src/games/entities/game.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reviews')
@Index(['userId', 'gameId'], { unique: true })
export class ReviewEntity implements IReviewEntity {
  @ReviewEntityDoc.Id()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ReviewEntityDoc.UserId(false)
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ReviewEntityDoc.GameId(false)
  @Column('int', { name: 'game_id' })
  gameId: number;

  @ReviewEntityDoc.Content()
  @Column('text')
  content: string;

  @ReviewEntityDoc.Rate()
  @Column('smallint')
  rate: number;

  @ReviewEntityDoc.HelpfulCount()
  @Column('int', { default: 0 })
  helpfulCount: number;

  @ReviewEntityDoc.UnhelpfulCount()
  @Column('int', { default: 0 })
  unHelpfulCount: number;

  @ReviewEntityDoc.LastEdited()
  @Column('timestamptz', { nullable: true })
  lastEdited: Date | null;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => UserEntity, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GameEntity, (game) => game.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;
}

const _assertExact: ExactData<IReviewEntity, ReviewEntity> = true;
