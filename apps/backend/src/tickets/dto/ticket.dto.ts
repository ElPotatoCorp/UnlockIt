import { TicketEntityDoc } from 'src/docs/tickets/entities/ticket.entity.doc';
import { TicketEntity } from '../entities/ticket.entity';
import { ExactData, Ticket, TicketStatus } from '@unlockit/shared';
import { PublicUserDto } from 'src/user/dto/public-user.dto';
import { UserMapper } from 'src/user/user.mapper';

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

  static async fromEntity(ticket: TicketEntity): Promise<TicketDto> {
    const dto = new TicketDto();

    dto.id = ticket.id;
    dto.email = ticket.email;
    dto.reason = ticket.reason;
    dto.content = ticket.content;
    dto.status = ticket.status;
    dto.createdAt = ticket.createdAt;

    const user = await ticket.user;
    if (user) {
      dto.user = UserMapper.toPublic(user);
    }

    return dto;
  }
}

const _assertExact: ExactData<Ticket, TicketDto> = true;
