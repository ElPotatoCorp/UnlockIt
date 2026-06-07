import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthOptionalGuard } from 'src/auth/guards/jwt-auth-optional.guard';
import { User } from 'src/user/decorators/user.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { TicketsControllerDoc } from 'src/docs/tickets/tickets.controller.doc';
import { EntityExistsPipe } from 'src/common/pipes/entity-exists.pipe';
import { TicketEntity } from './entities/ticket.entity';
 
@TicketsControllerDoc.Controller()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
 
  @TicketsControllerDoc.Create()
  @Public()
  @UseGuards(JwtAuthOptionalGuard)
  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @User('sub') userId?: string,
  ) {
    return this.ticketsService.create(createTicketDto, userId ?? null);
  }
 
  @TicketsControllerDoc.FindAll()
  @Get()
  findAll(
    @User() user: JwtPayloadDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.ticketsService.findAll(user, paginationQueryDto);
  }
 
  @TicketsControllerDoc.FindOne()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @User() user: JwtPayloadDto,
  ) {
    return this.ticketsService.findOne(id, user);
  }
 
  @TicketsControllerDoc.Update()
  @Patch(':id')
  update(
    @Param('id', EntityExistsPipe(TicketEntity)) ticket: TicketEntity,
    @Body() updateTicketDto: UpdateTicketDto,
    @User() user: JwtPayloadDto,
  ) {
    if (user.permission === null) {
      throw new ForbiddenException('Only employees can update ticket status');
    }
 
    return this.ticketsService.update(ticket, updateTicketDto);
  }
 
  @TicketsControllerDoc.Remove()
  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id', EntityExistsPipe(TicketEntity)) ticket: TicketEntity,
    @User() user: JwtPayloadDto,
  ) {
    if (user.permission === null) {
      throw new ForbiddenException('Only employees can delete tickets');
    }
 
    return this.ticketsService.remove(ticket);
  }
}
