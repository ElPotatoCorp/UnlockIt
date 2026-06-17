import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { DecimalColumnTransformer } from 'src/common/transformers/decimal-column.transformer';
import { WalletTransactionType } from '@unlockit/shared';
import {
  ExactData,
  WalletTransactionEntity as IWalletTransactionEntity,
} from '@unlockit/shared';

@Entity('wallet_transactions')
export class WalletTransactionEntity implements IWalletTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string | null;

  @Column('uuid', { name: 'order_id', nullable: true })
  orderId: string | null;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({ type: 'enum', enum: WalletTransactionType })
  type: WalletTransactionType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => UserEntity, (user) => user.walletTransactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.walletTransactions)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}

const _assertExact: ExactData<
  IWalletTransactionEntity,
  WalletTransactionEntity
> = true;
