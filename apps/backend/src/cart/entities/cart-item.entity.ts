import { GameEntity } from 'src/games/entities/game.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { ExactData, CartItemEntity as ICartItemEntity } from '@unlockit/shared';

@Check(`"quantity" > 0`)
@Entity('cart_items')
export class CartItemEntity implements ICartItemEntity {
  @PrimaryColumn('uuid', { name: 'cart_id' })
  cartId: string;

  @PrimaryColumn('bigint', { name: 'game_id' })
  gameId: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @ManyToOne(() => GameEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('boolean', { default: true })
  selected: boolean;

  @CreateDateColumn({
    name: 'added_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  addedAt: Date;
}

const _assertExact: ExactData<ICartItemEntity, CartItemEntity> = true;
