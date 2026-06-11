import { PublicUser, UserEntity } from "../user/user.types";
import { OmitPromises, Simplify } from "../utils/types";
import { TicketStatus } from "./ticket.enums";

export type TicketEntity = {
  id: string;
  email: string;
  reason: string;
  content: string;
  status: TicketStatus;
  createdAt: Date;
  userId: string | null;
  user: Promise<UserEntity | null>;
}

export type Ticket = Simplify<Omit<OmitPromises<TicketEntity>, 'userId'> & { user: PublicUser | null; }>;

export type CreateTicket = Pick<TicketEntity, 'email' | 'reason' | 'content'>;

export type UpdateTicket = Partial<Pick<TicketEntity, 'status'>>;