import { ExactData, TicketStatus, UpdateTicket } from '@unlockit/shared';
import { IsEnum, IsOptional } from 'class-validator';
import { TicketEntityDoc } from 'src/docs/tickets/entities/ticket.entity.doc';

export class UpdateTicketDto implements UpdateTicket {
  @TicketEntityDoc.Status()
  @IsOptional() @IsEnum(TicketStatus)
  status?: TicketStatus;
}

const _assertExact: ExactData<UpdateTicket, UpdateTicketDto> = true;