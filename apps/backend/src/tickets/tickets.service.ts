import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketDto } from './dto/ticket.dto';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
 
// Password reset tickets are internal, never exposed via the public API
const EXCLUDE_RESET_PASSWORD: FindOptionsWhere<Ticket> = {
  reason: Not('RESET PASSWORD'),
};
 
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly commonService: CommonService,
  ) {}
 
  async create(
    dto: CreateTicketDto,
    userId: string | null,
  ): Promise<TicketDto> {
    const ticket = await this.ticketRepository.save({
      ...dto,
      userId: userId ?? null,
    });
 
    return TicketDto.fromEntity(ticket);
  }
 
  findAll(user: JwtPayloadDto, paginationQueryDto: PaginationQueryDto) {
    // Employees see everything; regular users see only their own
    const ownerFilter: FindOptionsWhere<Ticket> =
      user.permission !== null ? {} : { userId: user.sub };
 
    return this.commonService.getPaginatedResponse(
      this.ticketRepository,
      paginationQueryDto,
      {
        where: { ...ownerFilter, ...EXCLUDE_RESET_PASSWORD },
        transform: TicketDto.fromEntity,
      },
    );
  }
 
  async findOne(id: string, user: JwtPayloadDto): Promise<TicketDto> {
    const ticket = await this.ticketRepository.findOneBy({ id });
 
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
 
    // Regular users can only see their own tickets
    if (user.permission === null && ticket.userId !== user.sub) {
      throw new ForbiddenException('You do not have access to this ticket');
    }
 
    return TicketDto.fromEntity(ticket);
  }
 
  async update(
    ticket: Ticket,
    dto: UpdateTicketDto,
  ): Promise<TicketDto> {
    await this.ticketRepository.update(ticket.id, dto);
 
    return TicketDto.fromEntity({ ...ticket, ...dto });
  }
 
  async remove(ticket: Ticket): Promise<void> {
    await this.ticketRepository.delete(ticket.id);
  }
}
