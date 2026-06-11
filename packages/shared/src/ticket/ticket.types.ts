import { UserEntity } from "../user/user.types";
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