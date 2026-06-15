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
import { CreatePasswordResetDto } from '../auth/dto/create-password-reset.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { randomUUID } from 'crypto';

// Password reset tickets are internal, never exposed via the public API
const EXCLUDE_RESET_PASSWORD: FindOptionsWhere<TicketEntity> = {
  reason: Not('RESET PASSWORD'),
};

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async createPasswordResetTicket(
    createPasswordResetDto: CreatePasswordResetDto,
  ): Promise<string> {
    const user = await this.userRepository
      .findOne({
        select: ['email'],
        where: [
          { username: createPasswordResetDto.identifier },
          { email: createPasswordResetDto.identifier },
        ],
      })
      .then((value) => (value ? { id: value.id, email: value.email } : null));

    if (!user) {
      throw new NotFoundException(
        `There is no user who's email or username matches ${createPasswordResetDto.identifier}`,
      );
    }

    const uuid = randomUUID();

    const ticket = this.ticketRepository.create({
      id: uuid,
      userId: user.id,
      email: user.email,
      reason: 'RESET PASSWORD',
      content: `This ticket has been automatically generated for a password reset request.\nPlease do not reply.\nIf you did not request a password reset, please ignore this message.\nOtherwise, please, follow <a href="https://placeholder.com/reset-password/${uuid}">this link</a> to reset your password.`,
    });
    this.ticketRepository.save(ticket);

    return uuid;
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
        transform: { fn: TicketDto.fromEntity },
      },
    );
  }

  async findOne(ticket: TicketEntity, user: JwtPayloadDto): Promise<TicketDto> {
    if (user.permission === null && ticket.userId !== user.sub) {
      throw new ForbiddenException('You do not have access to this ticket');
    }

    return TicketDto.fromEntity(ticket);
  }

  async update(
    ticket: TicketEntity,
    updateTicketDto: UpdateTicketDto,
  ): Promise<TicketDto> {
    await this.ticketRepository.update(ticket.id, updateTicketDto);

    return TicketDto.fromEntity({ ...ticket, ...updateTicketDto });
  }

  async remove(id: number): Promise<void> {
    await this.ticketRepository.delete(id);
  }
}
