import { TicketEntityDoc } from 'src/docs/tickets/entities/ticket.entity.doc';
import { ExactData, Ticket, TicketStatus } from '@unlockit/shared';
import { PublicUserDto } from 'src/user/dto/public-user.dto';

export class TicketDto implements Ticket {
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

  @TicketEntityDoc.User()
  user: PublicUserDto | null;
}

const _assertExact: ExactData<Ticket, TicketDto> = true;
