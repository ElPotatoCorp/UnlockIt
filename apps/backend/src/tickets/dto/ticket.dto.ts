import { TicketEntityDoc } from 'src/docs/tickets/entities/ticket.entity.doc';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketStatus } from '@unlockit/shared';

export class TicketDto {
  @TicketEntityDoc.Id()
  id: string;

  @TicketEntityDoc.Email()
  email: string;

  @TicketEntityDoc.Reason()
  reason: string;

  @TicketEntityDoc.Content()
  content: string;

  @TicketEntityDoc.Status()
  status: TicketStatus;

  @TicketEntityDoc.CreatedAt()
  createdAt: Date;

  @TicketEntityDoc.UserId()
  userId: string | null;

  static fromEntity(ticket: TicketEntity): TicketDto {
    const dto = new TicketDto();
    dto.id = ticket.id;
    dto.email = ticket.email;
    dto.reason = ticket.reason;
    dto.content = ticket.content;
    dto.status = ticket.status;
    dto.createdAt = ticket.createdAt;
    dto.userId = ticket.userId;
    return dto;
  }
}
