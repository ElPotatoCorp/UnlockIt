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
@Index('idx_soft_delete', ['soldAt'])
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
  @DeleteDateColumn({ type: 'timestamptz', name: 'sold_at', nullable: true })
  soldAt: Date | null;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => GameEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;

  @ManyToOne(() => OrderItemEntity, (item) => item.stocks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([
    { name: 'order_id', referencedColumnName: 'orderId' },
    { name: 'game_id', referencedColumnName: 'gameId' },
  ])
  orderItem: OrderItemEntity | null;
}

const _assertExact: ExactData<IStockEntity, StockEntity> = true;
