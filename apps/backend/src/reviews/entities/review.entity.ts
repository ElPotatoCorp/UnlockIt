import { ExactData, ReviewEntity as IReviewEntity } from "@unlockit/shared";
import { GameEntity } from "src/games/entities/game.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reviews')
@Index(['userId', 'gameId'], { unique: true })
export class ReviewEntity implements IReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('int', { name: 'game_id' })
  gameId: number;

  @Column('text')
  content: string;

  @Column('smallint')
  rate: number;

  @Column('int', { default: 0 })
  helpfulCount: number;

  @Column('int', { default: 0 })
  unhelpfulCount: number;

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