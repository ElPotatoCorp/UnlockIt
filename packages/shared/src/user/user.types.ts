import { CartEntity } from "../cart/cart.types";
import { EmployeeEntity } from "../employee/employee.types";
import { SessionEntity } from "../session/session.types";
import { TicketEntity } from "../ticket/ticket.types";
import { OmitPromises } from "../utils/types";
import { WishlistEntity } from "../wishlist/wishlist.types";

export type UserEntity = {
  id: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;

  // -------------------------------------------------------
  // Relations - not loaded unless explicitly requested
  // -------------------------------------------------------

  employee: Promise<EmployeeEntity | null>;
  profile: Promise<UserProfile | null>;
  billing: Promise<UserBilling | null>;
  sessions: Promise<SessionEntity[]>;
  tickets: Promise<TicketEntity[]>;
  cart: Promise<CartEntity>;
  wishlist: Promise<WishlistEntity[]>;
};

export type UserProfileEntity = {
  userId: string;
  user: User;
  firstName: string | null;
  lastName: string | null;
  birthdate: string | null;
  country: string | null;
  newsletter: boolean;
}
export type UserProfile = Omit<UserProfileEntity, 'userId' | 'user'>;

export type UserBillingEntity = {
  userId: string;
  user: User;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string | null;
}
export type UserBilling = Omit<UserBillingEntity, 'userId' | 'user'>;

export type User = Omit<OmitPromises<UserEntity>, 'password'>;

export type PublicUser = Pick<UserEntity, 'id' | 'username' | 'bio' | 'avatar' | 'createdAt'>;

export type CreateUser = Pick<UserEntity, 'username' | 'password' | 'email'>;

export type UpdateUser = Partial<CreateUser & Pick<UserEntity, 'phoneNumber' | 'bio'>>;

export type UpdateProfile = Partial<UserProfile>;

export type UpdateBilling = Partial<UserBilling>;