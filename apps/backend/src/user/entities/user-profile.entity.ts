import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import {
  Entity,
  PrimaryColumn,
  Column,
  Check,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import {
  ExactData,
  UserProfileEntity as IUserProfileEntity,
} from '@unlockit/shared';

@Entity('user_profile')
@Check(`"country" ~ '^[A-Z]{2}$' OR "country" IS NULL`)
@Check(`"birthdate" < NOW() OR "birthdate" IS NULL`)
@Check(`"birthdate" <= NOW() - INTERVAL '13 years' OR "birthdate" IS NULL`)
export class UserProfileEntity implements IUserProfileEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @UserEntityDoc.FirstName(true)
  @Column('varchar', { name: 'first_name', length: 100, nullable: true })
  firstName: string | null;

  @UserEntityDoc.LastName(true)
  @Column('varchar', { name: 'last_name', length: 100, nullable: true })
  lastName: string | null;

  @UserEntityDoc.Birthdate()
  @Column('date', { nullable: true })
  birthdate: string | null;

  @UserEntityDoc.Country(true)
  @Column('char', { length: 2, nullable: true })
  country: string | null;

  @UserEntityDoc.Newsletter()
  @Column({ default: false })
  newsletter: boolean;
}

const _assertExact: ExactData<IUserProfileEntity, UserProfileEntity> = true;
