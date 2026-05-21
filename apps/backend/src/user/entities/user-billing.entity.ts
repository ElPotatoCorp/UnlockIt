import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import {
  Entity,
  PrimaryColumn,
  Column,
  Check,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_billing')
@Check(`"country" ~ '^[A-Z]{2}$'`)
export class UserBilling {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.billing)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @UserEntityDoc.FirstName(false)
  @Column('varchar', { name: 'first_name', length: 100 })
  firstName: string;

  @UserEntityDoc.LastName(false)
  @Column('varchar', { name: 'last_name', length: 100 })
  lastName: string;

  @UserEntityDoc.Country(false)
  @Column('char', { length: 2 })
  country: string;

  @UserEntityDoc.City()
  @Column('varchar', { length: 100 })
  city: string;

  @UserEntityDoc.PostalCode()
  @Column('varchar', { name: 'postal_code', length: 20 })
  postalCode: string;

  @UserEntityDoc.AddressLine1()
  @Column('varchar', { name: 'address_line_1', length: 255 })
  addressLine1: string;

  @UserEntityDoc.AddressLine2()
  @Column('varchar', { name: 'address_line_2', length: 255, nullable: true })
  addressLine2: string | null;
}
