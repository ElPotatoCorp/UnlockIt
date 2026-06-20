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
import { WalletTransactionEntityDoc } from 'src/docs/wallet/entities/wallet-transaction.entity.doc';

@Entity('wallet_transactions')
export class WalletTransactionEntity implements IWalletTransactionEntity {
  @WalletTransactionEntityDoc.Id()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @WalletTransactionEntityDoc.UserId(false)
  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string | null;

  @WalletTransactionEntityDoc.OrderId(false)
  @Column('uuid', { name: 'order_id', nullable: true })
  orderId: string | null;

  @WalletTransactionEntityDoc.Amount()
  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @WalletTransactionEntityDoc.Type()
  @Column({ type: 'enum', enum: WalletTransactionType })
  type: WalletTransactionType;

  @WalletTransactionEntityDoc.CreatedAt()
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
