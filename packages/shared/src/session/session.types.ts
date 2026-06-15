import { UserEntity } from "../user/user.types";
import { Simplify } from "../utils/types";

export type SessionEntity = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastSeenAt: Date;
  flagged: boolean;

  // -------------------------------------------------------
  // Relations - not loaded unless explicitly requested
  // -------------------------------------------------------

  user: UserEntity;
}

export type CreateSession = Simplify<{
  id?: string
} & Omit<SessionEntity, 'id' | 'createdAt' | 'lastSeenAt' | 'flagged' | 'user' | 'expiresAt'> & {
  expiresAt?: Date;
}>;

export type UpdateSession = Simplify<Partial<Omit<CreateSession, 'id' | 'userId' | 'expiresAt'>> & Partial<Pick<SessionEntity, 'flagged'>>>;