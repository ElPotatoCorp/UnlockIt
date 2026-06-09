import { GameEntity } from 'src/games/entities/game.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryColumn('uuid', { name: 'cart_id' })
  cartId: string;

  @PrimaryColumn('bigint', { name: 'game_id' })
  gameId: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @ManyToOne(() => GameEntity, (game) => game.wishlists, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Promise<GameEntity>;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('boolean', { default: true })
  selected: boolean;

  @CreateDateColumn({ name: 'added_at', type: 'timestamptz', default: () => 'NOW()' })
  addedAt: Date;
}
