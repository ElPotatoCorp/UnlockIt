import { UserEntityDoc } from "src/docs/user/entities/user.entity.doc";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  Check,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { UserProfile } from "./user-profile.entity";
import { UserBilling } from "./user-billing.entity";
import { DecimalColumnTransformer } from "src/common/transformers/decimal-column.transformer";

@Entity('users')
@Unique(['username'])
@Unique(['email'])
@Unique(['phoneNumber'])
@Check(`("email" IS NOT NULL) OR ("phone_country_code" IS NOT NULL AND "phone_number" IS NOT NULL)`)
@Check(`"email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' OR "email" IS NULL`)
@Check(`("phone_country_code" ~ '^\\d{1,3}$' AND "phone_number" ~ '^\\d{7,15}$') OR ("phone_country_code" IS NULL AND "phone_number" IS NULL)`)
@Check(`LENGTH(TRIM("username")) >= 3`)
@Check(`"wallet" >= 0`)
export class User {
  @UserEntityDoc.Id()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UserEntityDoc.Username()
  @Column({ length: 50 })
  username: string;

  @UserEntityDoc.Password()
  @Column('varchar', { length: 255, select: false }) // never returned by default
  password: string;

  @UserEntityDoc.Email()
  @Column('varchar', { length: 255, unique: true })
  email: string;

  @UserEntityDoc.PhoneNumber()
  @Column('varchar', { name: 'phone_number', length: 20, nullable: true, unique: true })
  phoneNumber: string | null;

  @UserEntityDoc.Bio()
  @Column('text', { nullable: true })
  bio: string | null;

  @UserEntityDoc.Avatar()
  @Column('varchar', { length: 255, nullable: true })
  avatar: string | null;

  @UserEntityDoc.Wallet()
  @Column('numeric', { precision: 10, scale: 2, default: 0, transformer: new DecimalColumnTransformer() })
  wallet: number;

  @UserEntityDoc.CreatedAt()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // -------------------------------------------------------
  // Relations - not loaded unless explicitly requested
  // -------------------------------------------------------

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    lazy: true,
    cascade: true,
    nullable: true,
  })
  profile: Promise<UserProfile | null>;

  @OneToOne(() => UserBilling, (billing) => billing.user, {
    lazy: true,
    cascade: true,
    nullable: true,
  })
  billing: Promise<UserBilling | null>;
}