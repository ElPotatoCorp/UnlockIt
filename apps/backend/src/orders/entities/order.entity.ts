import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderItemEntity } from './order-item.entity';
import { WalletTransactionEntity } from 'src/wallet/entities/wallet-transaction.entity';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column.transformer';
import { OrderStatus } from '@unlockit/shared';
import { ExactData, OrderEntity as IOrderEntity } from '@unlockit/shared';
import { OrderEntityDoc } from 'src/docs/orders/entities/order.entity.doc';

@Entity('orders')
@Index(['userId'])
@Index(['status'])
export class OrderEntity implements IOrderEntity {
  @OrderEntityDoc.Id()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OrderEntityDoc.UserId(false)
  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string | null;

  @OrderEntityDoc.Status()
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT,
  })
  status: OrderStatus;

  @OrderEntityDoc.AmountPaidWallet()
  @Column('numeric', {
    name: 'amount_paid_wallet',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  amountPaidWallet: number;

  @OrderEntityDoc.AmountPaidStripe()
  @Column('numeric', {
    name: 'amount_paid_stripe',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  amountPaidStripe: number;

  @OrderEntityDoc.CreatedAt()
  @CreateDateColumn({ name: 'reserved_at', type: 'timestamptz' })
  createdAt: Date;

  @OrderEntityDoc.CompletedAt()
  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: ['insert', 'remove'],
  })
  items: OrderItemEntity[];

  @OneToMany(
    () => WalletTransactionEntity,
    (walletTransaction) => walletTransaction.order,
    {
      cascade: ['insert', 'remove'],
    },
  )
  walletTransactions: WalletTransactionEntity[];
}

const _assertExact: ExactData<IOrderEntity, OrderEntity> = true;
