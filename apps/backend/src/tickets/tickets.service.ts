import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { TicketEntity } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketDto } from './dto/ticket.dto';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';

// Password reset tickets are internal, never exposed via the public API
const EXCLUDE_RESET_PASSWORD: FindOptionsWhere<TicketEntity> = {
  reason: Not('RESET PASSWORD'),
};

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private readonly commonService: CommonService,
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
    userId: string | null,
  ): Promise<TicketDto> {
    const _ticket = this.ticketRepository.create({
      ...createTicketDto,
      userId: userId ?? null,
    });
    const ticket = await this.ticketRepository.save(_ticket);

    return TicketDto.fromEntity(ticket);
  }

  findAll(user: JwtPayloadDto, paginationQueryDto: PaginationQueryDto) {
    // Employees see everything; regular users see only their own
    const ownerFilter: FindOptionsWhere<TicketEntity> =
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

  async update(ticket: TicketEntity, updateTicketDto: UpdateTicketDto): Promise<TicketDto> {
    await this.ticketRepository.update(ticket.id, updateTicketDto);

    return TicketDto.fromEntity({ ...ticket, ...updateTicketDto });
  }

  async remove(ticket: TicketEntity): Promise<void> {
    await this.ticketRepository.delete(ticket.id);
  }
}
