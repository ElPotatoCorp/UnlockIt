import { User } from "../user/user.types";

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

  user: Promise<User>;
}