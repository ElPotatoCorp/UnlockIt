import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	Check,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
@Unique(['phoneWzc', 'phoneNumber'])
@Check(`("email" IS NOT NULL) OR ("phone_wzc" IS NOT NULL AND "phone_number" IS NOT NULL)`)
@Check(`"email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR "email" IS NULL`)
@Check(`"phone_wzc" ~ '^\\d{1,3}$' AND "phone_number" ~ '^\\d{7,15}$' OR ("phone_wzc" IS NULL AND "phone_number" IS NULL)`)
@Check(`"birthday_date" < NOW() OR "birthday_date" IS NULL`)
@Check(`LENGTH(TRIM("username")) >= 3`)
@Check(`LENGTH("password") >= 8`)
@Check(`"wallet" >= 0`)
export class User {
	@UserEntityDoc.Id()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@UserEntityDoc.Username()
	@Column({ length: 50 })
	username: string;

	@UserEntityDoc.Password()
	@Column('char', { length: 60 })
	password: string;

	@UserEntityDoc.Email()
	@Column('varchar', { length: 255, nullable: true, unique: true })
	email: string | null;

	@UserEntityDoc.PhoneWzc()
	@Column('varchar', { name: 'phone_wzc', length: 3, nullable: true })
	phoneWzc: string | null;

	@UserEntityDoc.PhoneNumber()
	@Column('varchar', { name: 'phone_number', length: 15, nullable: true })
	phoneNumber: string | null;

	@UserEntityDoc.Bio()
	@Column('text', { nullable: true })
	bio: string | null;

	@UserEntityDoc.Avatar()
	@Column('varchar', { length: 255, nullable: true })
	avatar: string | null;

	@UserEntityDoc.Wallet()
	@Column('numeric', { precision: 19, scale: 4, default: 0 })
	wallet: number;

	@UserEntityDoc.CreationDate()
	@Column('date', { name: 'creation_date', default: () => 'NOW()' })
	creationDate: string;

	@UserEntityDoc.FirstName()
	@Column('varchar', { name: 'first_name', length: 100, nullable: true })
	firstName: string | null;

	@UserEntityDoc.LastName()
	@Column('varchar', { name: 'last_name', length: 100, nullable: true })
	lastName: string | null;

	@UserEntityDoc.Country()
	@Column('varchar', { length: 100, nullable: true })
	country: string | null;

	@UserEntityDoc.BillingAddress()
	@Column('text', { name: 'billing_address', nullable: true })
	billingAddress: string | null;

	@UserEntityDoc.NewsletterSubscribed()
	@Column({ name: 'newsletter_subscription', default: false })
	newsletterSubscribed: boolean;

	@UserEntityDoc.BirthdayDate()
	@Column('date', { name: 'birthday_date', nullable: true })
	birthdayDate: string | null;

	@UserEntityDoc.CartId()
	@Column('uuid', { name: 'cart_id', nullable: true })
	cartId: string | null;
}
