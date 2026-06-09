import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItemEntity } from './cart-item.entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Promise<UserEntity>;

  @OneToMany(() => CartItemEntity, (item) => item.cart, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  items: Promise<CartItemEntity[]>;
}
