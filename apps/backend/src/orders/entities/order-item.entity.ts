import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { GameEntity } from 'src/games/entities/game.entity';
import { OrderEntity } from './order.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column.transformer';
import {
  ExactData,
  OrderItemEntity as IOrderItemEntity,
} from '@unlockit/shared';

@Entity('order_items')
export class OrderItemEntity implements IOrderItemEntity {
  @PrimaryColumn('uuid', { name: 'order_id' })
  orderId: string;

  @PrimaryColumn('bigint', { name: 'game_id' })
  gameId: number;

  @Column('smallint')
  quantity: number;

  /** Price per unit at the moment the order was placed. */
  @Column('numeric', {
    name: 'unit_price',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  unitPrice: number;

  // -------------------------------------------------------
  // Relations — not loaded unless explicitly requested
  // -------------------------------------------------------

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => GameEntity, { lazy: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'game_id' })
  game: Promise<GameEntity>;

  /**
   * The stock rows linked to this order item.
   * Populated after checkout completes — these are the sold keys.
   */
  @OneToMany(() => StockEntity, (stock) => stock.orderItem, { lazy: true })
  stocks: Promise<StockEntity[]>;
}

const _assertExact: ExactData<IOrderItemEntity, OrderItemEntity> = true;
