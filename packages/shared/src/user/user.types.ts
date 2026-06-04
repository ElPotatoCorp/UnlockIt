import { Session } from "../session/session.types";

export type UserEntity = {
  id: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  avatar: string | null;
  wallet: number;
  createdAt: Date;

  // -------------------------------------------------------
  // Relations - not loaded unless explicitly requested
  // -------------------------------------------------------

  profile: Promise<UserProfile | null>;
  billing: Promise<UserBilling | null>;
  sessions: Promise<Session[]>;
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

export type User = Omit<UserEntity, 'password' | 'profile' | 'billing' | 'sessions'>;

export type PublicUser = Pick<UserEntity, 'id' | 'username' | 'bio' | 'avatar' | 'createdAt'>;

export type CreateUser = Pick<UserEntity, 'username' | 'password' | 'email'>;

export type UpdateUser = Partial<CreateUser & Pick<UserEntity, 'phoneNumber' | 'bio'>>;

export type UpdateProfile = Partial<UserProfile>;

export type UpdateBilling = Partial<UserBilling>;