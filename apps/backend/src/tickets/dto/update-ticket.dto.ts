import { TicketStatus } from '@unlockit/shared';
import { IsEnum } from 'class-validator';
import { TicketEntityDoc } from 'src/docs/tickets/entities/ticket.entity.doc';

export class UpdateTicketDto {
  @TicketEntityDoc.Status()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
