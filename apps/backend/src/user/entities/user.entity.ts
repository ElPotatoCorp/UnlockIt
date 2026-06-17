import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { UserBillingEntity } from './user-billing.entity';
import { SessionEntity } from 'src/sessions/entities/session.entity';
import { TicketEntity } from 'src/tickets/entities/ticket.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { genSalt, hash } from 'bcrypt-ts';
import { ExactData, UserEntity as IUserEntity } from '@unlockit/shared';
import { WishlistEntity } from 'src/wishlist/entities/wishlist.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { WalletTransactionEntity } from 'src/wallet/entities/wallet-transaction.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';

export async function hashPassword(password: string) {
  const salt = await genSalt(12);
  return hash(password, salt);
}

@Entity('users')
@Check(`"email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`)
@Check(`LENGTH(TRIM("username")) >= 3`)
export class UserEntity implements IUserEntity {
  @UserEntityDoc.Id()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UserEntityDoc.Username()
  @Column({ length: 50, unique: true })
  username: string;

  @UserEntityDoc.Password()
  @Column('varchar', { length: 255, select: false }) // never returned by default
  password: string;

  @UserEntityDoc.Email()
  @Column('varchar', { length: 255, unique: true })
  email: string;

  @UserEntityDoc.PhoneNumber()
  @Column('varchar', {
    name: 'phone_number',
    length: 20,
    nullable: true,
    unique: true,
  })
  phoneNumber: string | null;

  @UserEntityDoc.Bio()
  @Column('text', { nullable: true })
  bio: string | null;

  @UserEntityDoc.Avatar()
  @Column('varchar', { length: 255, nullable: true })
  avatar: string | null;

  @UserEntityDoc.CreatedAt()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // =====================================================
  // Relations
  // =====================================================

  @OneToOne(() => EmployeeEntity, (employee) => employee.user, {
    cascade: ['insert', 'remove'],
    nullable: true,
  })
  employee: EmployeeEntity | null;

  @OneToOne(() => UserProfileEntity, (profile) => profile.user, {
    cascade: ['insert', 'update'],
    nullable: true,
  })
  profile: UserProfileEntity | null;

  @OneToOne(() => UserBillingEntity, (billing) => billing.user, {
    cascade: ['insert', 'update'],
    nullable: true,
  })
  billing: UserBillingEntity | null;

  @OneToMany(() => SessionEntity, (session) => session.user, {
    cascade: ['remove'],
  })
  sessions: SessionEntity[];

  @OneToMany(() => TicketEntity, (ticket) => ticket.user, {
    cascade: ['remove'],
  })
  tickets: TicketEntity[];

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.user, {
    cascade: ['insert', 'remove'],
  })
  wishlist: WishlistEntity[];

  @OneToOne(() => CartEntity, (cart) => cart.user, {
    cascade: ['insert'],
  })
  cart: CartEntity;

  @OneToMany(() => WalletTransactionEntity, (walletTransaction) => walletTransaction.user, {
    onDelete: 'SET NULL',
  })
  walletTransactions: WalletTransactionEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @BeforeInsert()
  async setPassword() {
    this.password = await hashPassword(this.password);
  }
}

const _assertExact: ExactData<IUserEntity, UserEntity> = true;
