import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameEntity } from 'src/games/entities/game.entity';
import { OrderItemEntity } from 'src/orders/entities/order-item.entity';
import { ExactData, StockEntity as IStockEntity } from '@unlockit/shared';

@Entity('stocks')
@Index('idx_used_at_soft_delete', ['usedAt'])
export class StockEntity implements IStockEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', {
    name: 'product_key',
    length: 100,
    unique: true,
    select: false,
  })
  productKey: string;

  @Column('bigint', { name: 'game_id' })
  gameId: number;

  @Column('uuid', { name: 'order_id', nullable: true })
  orderId: string | null;

  /** Soft-delete timestamp. Non-null = key has been delivered (sold). */
  @DeleteDateColumn({ name: 'used_at', nullable: true })
  usedAt: Date | null;

  // -------------------------------------------------------
  // Relations - lazy
  // -------------------------------------------------------

  @ManyToOne(() => GameEntity, {
    lazy: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'game_id' })
  game: Promise<GameEntity>;

  /**
   * Composite FK pointing back to the order_items row.
   * Only set once the order transitions to COMPLETED.
   */
  @ManyToOne(() => OrderItemEntity, (item) => item.stocks, {
    lazy: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([
    { name: 'order_id', referencedColumnName: 'orderId' },
    { name: 'game_id', referencedColumnName: 'gameId' },
  ])
  orderItem: Promise<OrderItemEntity | null>;
}

const _assertExact: ExactData<IStockEntity, StockEntity> = true;
