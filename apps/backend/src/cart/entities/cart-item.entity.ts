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
import { CartItemEntityDoc } from 'src/docs/carts/entities/cart-item.entity.doc';

@Check(`"quantity" > 0`)
@Entity('cart_items')
export class CartItemEntity implements ICartItemEntity {
  @CartItemEntityDoc.CartId(false)
  @PrimaryColumn('uuid', { name: 'cart_id' })
  cartId: string;

  @CartItemEntityDoc.GameId(false)
  @PrimaryColumn('bigint', { name: 'game_id' })
  gameId: number;

  @CartItemEntityDoc.Quantity()
  @Column('int', { default: 1 })
  quantity: number;

  @CartItemEntityDoc.Selected()
  @Column('boolean', { default: true })
  selected: boolean;

  @CartItemEntityDoc.AddedAt()
  @CreateDateColumn({
    name: 'added_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  addedAt: Date;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => CartEntity, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @ManyToOne(() => GameEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;
}

const _assertExact: ExactData<ICartItemEntity, CartItemEntity> = true;
