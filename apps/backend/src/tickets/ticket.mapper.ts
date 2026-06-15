import { UserMapper } from "src/user/user.mapper";
import { TicketDto } from "./dto/ticket.dto";
import { TicketEntity } from "./entities/ticket.entity";

export class TicketMapper {
  static toTicket(ticket: TicketEntity) {
    const dto = new TicketDto();

    dto.id = ticket.id;
    dto.email = ticket.email;
    dto.reason = ticket.reason;
    dto.content = ticket.content;
    dto.status = ticket.status;
    dto.createdAt = ticket.createdAt;

    if (ticket.user) {
      dto.user = UserMapper.toPublic(ticket.user);
    }

    return dto;
  }
}