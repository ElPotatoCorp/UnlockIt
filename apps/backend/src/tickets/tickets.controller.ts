import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthOptionalGuard } from 'src/auth/guards/jwt-auth-optional.guard';
import { User } from 'src/user/decorators/user.decorator';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Public()
  @UseGuards(JwtAuthOptionalGuard)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @User('sub') userId?: string) {
    return this.ticketsService.create({ ...createTicketDto, userId });
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
