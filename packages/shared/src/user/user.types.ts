import { CartEntity } from "../cart/cart.types";
import { EmployeeEntity } from "../employee/employee.types";
import { OrderEntity } from "../order/order.types";
import { ReviewEntity } from "../review/review.types";
import { SessionEntity } from "../session/session.types";
import { TicketEntity } from "../ticket/ticket.types";
import { WalletTransactionEntity } from "../wallet/wallet.types";
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

  employee: EmployeeEntity | null;
  profile: UserProfile | null;
  billing: UserBilling | null;
  sessions: SessionEntity[];
  tickets: TicketEntity[];
  cart: CartEntity;
  wishlist: WishlistEntity[];
  walletTransactions:  WalletTransactionEntity[];
  orders: OrderEntity[];
  reviews: ReviewEntity[];
};
type UserRelationKeys = 'employee' | 'profile' | 'billing' | 'sessions' | 'tickets' | 'cart' | 'wishlist' | 'walletTransactions' | 'orders' | 'reviews';

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

export type User = Omit<UserEntity, 'password' | UserRelationKeys>;

export type PublicUser = Pick<UserEntity, 'id' | 'username' | 'bio' | 'avatar' | 'createdAt'>;

export type CreateUser = Pick<UserEntity, 'username' | 'password' | 'email'>;

export type UpdateUser = Partial<CreateUser & Pick<UserEntity, 'phoneNumber' | 'bio'>>;

export type UpdateProfile = Partial<UserProfile>;

export type UpdateBilling = Partial<UserBilling>;