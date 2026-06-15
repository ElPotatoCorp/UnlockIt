import {
  Column,
  CreateDateColumn,
  Entity,
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

@Entity('orders')
export class OrderEntity implements IOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT,
  })
  status: OrderStatus;

  @Column('numeric', {
    name: 'amount_paid_wallet',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  amountPaidWallet: number;

  @Column('numeric', {
    name: 'amount_paid_stripe',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  amountPaidStripe: number;

  @CreateDateColumn({ name: 'reserved_at', type: 'timestamptz' })
  reservedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  // -------------------------------------------------------
  // Relations - not loaded unless explicitly requested
  // -------------------------------------------------------

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    lazy: true,
    cascade: ['insert'],
  })
  items: OrderItemEntity[];

  @OneToMany(
    () => WalletTransactionEntity,
    (walletTransaction) => walletTransaction.order,
    {
      lazy: true,
      cascade: true,
    },
  )
  walletTransactions: WalletTransactionEntity[];
}

const _assertExact: ExactData<IOrderEntity, OrderEntity> = true;
