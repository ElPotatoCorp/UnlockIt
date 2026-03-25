import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	Check,
} from 'typeorm';

@Entity('user')
@Unique(['email'])
@Unique(['phone_wzc', 'phone_number'])
@Check(`("email" IS NOT NULL) OR ("phone_wzc" IS NOT NULL AND "phone_number" IS NOT NULL)`)
@Check(`"email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR "email" IS NULL`)
@Check(`"phone_wzc" ~ '^\\d{1,3}$' AND "phone_number" ~ '^\\d{7,15}$' OR ("phone_wzc" IS NULL AND "phone_number" IS NULL)`)
@Check(`"birthday_date" < NOW() OR "birthday_date" IS NULL`)
@Check(`LENGTH(TRIM("username")) >= 3`)
@Check(`LENGTH("password") >= 8`)
@Check(`"wallet" >= 0`)
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 50 })
	username: string;

	@Column('char', { length: 60 })
	password: string;

	@Column({ length: 255, nullable: true, unique: true })
	email: string | null;

	@Column({ name: 'phone_wzc', length: 3, nullable: true })
	phoneWzc: string | null;

	@Column({ name: 'phone_number', length: 15, nullable: true })
	phoneNumber: string | null;

	@Column('text', { nullable: true })
	bio: string | null;

	@Column({ length: 255, nullable: true })
	avatar: string | null;

	@Column('numeric', { precision: 19, scale: 4, default: 0 })
	wallet: number;

	@Column('date', { name: 'creation_date', default: () => 'NOW()' })
	creationDate: string;

	//@Column({ type: 'uuid', unique: true })
	//cartId: string; TODO: Add relation with Cart entity

	@Column({ name: 'first_name', length: 100, nullable: true })
	firstName: string | null;

	@Column({ name: 'last_name', length: 100, nullable: true })
	lastName: string | null;

	@Column({ length: 100, nullable: true })
	country: string | null;

	@Column('text', { name: 'billing_address', nullable: true })
	billingAddress: string | null;

	@Column({ name: 'newsletter_subscription', default: false })
	newsletterSubscription: boolean;

	@Column('date', { name: 'birthday_date', nullable: true })
	birthdayDate: string | null;
}
