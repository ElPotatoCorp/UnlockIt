import { ExactData, ReviewEntity as IReviewEntity } from "@unlockit/shared";
import { GameEntity } from "src/games/entities/game.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('reviews')
export class ReviewEntity implements IReviewEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @PrimaryColumn('int', { name: 'game_id' })
  gameId: number;

  @Column('text')
  content: string;

  @Column('smallint')
  score: number;

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