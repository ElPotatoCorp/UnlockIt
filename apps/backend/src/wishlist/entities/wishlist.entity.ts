import { ExactData, WishlistEntity as IWishlistEntity } from '@unlockit/shared';
import { GameEntity } from 'src/games/entities/game.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('wishlist')
export class WishlistEntity implements IWishlistEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @PrimaryColumn('bigint', { name: 'game_id' })
  gameId: number;

  @ManyToOne(() => UserEntity, (user) => user.wishlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GameEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;

  @CreateDateColumn({ name: 'added_at', type: 'timestamptz' })
  addedAt: Date;
}

const _assertExact: ExactData<IWishlistEntity, WishlistEntity> = true;
