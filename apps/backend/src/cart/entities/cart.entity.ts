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
import { ExactData, CartEntity as ICartEntity } from '@unlockit/shared';

@Entity('carts')
export class CartEntity implements ICartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  // =====================================================
  // Relations
  // =====================================================

  @OneToOne(() => UserEntity, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (item) => item.cart, {
    cascade: true,
  })
  items: CartItemEntity[];

}

const _assertExact: ExactData<ICartEntity, CartEntity> = true;
