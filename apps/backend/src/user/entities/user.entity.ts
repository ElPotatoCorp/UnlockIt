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

  // -------------------------------------------------------
  // Relations - not loaded unless explicitly requested
  // -------------------------------------------------------

  @OneToOne(() => EmployeeEntity, (employee) => employee.user, {
    lazy: true,
    cascade: ['remove'],
    nullable: true,
  })
  employee: Promise<EmployeeEntity | null>;

  @OneToOne(() => UserProfileEntity, (profile) => profile.user, {
    lazy: true,
    cascade: true,
    nullable: true,
  })
  profile: Promise<UserProfileEntity | null>;

  @OneToOne(() => UserBillingEntity, (billing) => billing.user, {
    lazy: true,
    cascade: true,
    nullable: true,
  })
  billing: Promise<UserBillingEntity | null>;

  @OneToMany(() => SessionEntity, (session) => session.user, {
    lazy: true,
    cascade: ['remove'],
  })
  sessions: Promise<SessionEntity[]>;

  @OneToMany(() => TicketEntity, (ticket) => ticket.user, {
    lazy: true,
    cascade: ['remove'],
  })
  tickets: Promise<TicketEntity[]>;

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.user, { lazy: true })
  wishlist: Promise<WishlistEntity[]>;

  @OneToOne(() => CartEntity, (cart) => cart.user, {
    lazy: true,
    cascade: true,
  })
  cart: Promise<CartEntity>;

  @OneToMany(
    () => WalletTransactionEntity,
    (walletTransaction) => walletTransaction.user,
    {
      lazy: true,
      onDelete: 'SET NULL',
    },
  )
  walletTransactions: Promise<WalletTransactionEntity[]>;

  @OneToMany(() => OrderEntity, (order) => order.user, {
    lazy: true,
    onDelete: 'SET NULL',
  })
  orders: Promise<OrderEntity[]>;

  @BeforeInsert()
  async setPassword() {
    this.password = await hashPassword(this.password);
  }
}

const _assertExact: ExactData<IUserEntity, UserEntity> = true;
