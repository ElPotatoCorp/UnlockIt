import { IsEmail, IsString, Length } from 'class-validator';
import { TicketEntityDoc } from 'src/docs/tickets/entities/ticket.entity.doc';

export class CreateTicketDto {
  @TicketEntityDoc.Email()
  @IsEmail()
  @Length(1, 255)
  email: string;

  @TicketEntityDoc.Reason()
  @IsString()
  @Length(1, 255)
  reason: string;

  @TicketEntityDoc.Content()
  @IsString()
  @Length(1, 10_000)
  content: string;
}
