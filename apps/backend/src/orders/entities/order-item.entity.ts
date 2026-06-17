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

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => GameEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;

  @OneToMany(() => StockEntity, (stock) => stock.orderItem,{
    onDelete: 'RESTRICT',
  })
  stocks: StockEntity[];
}

const _assertExact: ExactData<IOrderItemEntity, OrderItemEntity> = true;
