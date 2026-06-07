import { IsEnum } from 'class-validator';
import { TicketEntityDoc } from 'src/docs/tickets/entities/ticket.entity.doc';
import { TicketStatus } from '../entities/ticket.entity';

export class UpdateTicketDto {
  @TicketEntityDoc.Status()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
