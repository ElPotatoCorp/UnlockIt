import { TicketEntityDoc } from 'src/docs/tickets/entities/ticket.entity.doc';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
 
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
 
  static fromEntity(ticket: Ticket): TicketDto {
    const dto        = new TicketDto();
    dto.id        = ticket.id;
    dto.email     = ticket.email;
    dto.reason    = ticket.reason;
    dto.content   = ticket.content;
    dto.status    = ticket.status;
    dto.createdAt = ticket.createdAt;
    dto.userId    = ticket.userId;
    return dto;
  }
}
