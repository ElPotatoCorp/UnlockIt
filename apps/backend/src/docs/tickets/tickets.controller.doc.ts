import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth/decorators/api-auth.decorator';
import { PaginatedDto } from 'src/common/pagination/dto/paginated.dto';
import { PaginatedDtoSchemaDoc } from 'src/docs/common/dto/paginated.dto.doc';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { UpdateTicketDto } from 'src/tickets/dto/update-ticket.dto';
import { TicketDto } from 'src/tickets/dto/ticket.dto';

const TICKET_ID_PARAM = ApiParam({
  name: 'id',
  type: String,
  format: 'uuid',
  description: 'UUID of the ticket.',
  example: 'f3a1c2d4-b5e7-4f9c-8d3a-1e2f3b4c5d6e',
});

export const TicketsControllerDoc = {
  Controller: () => applyDecorators(ApiTags('Tickets')),

  // POST /tickets
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Submit a support ticket',
        description:
          'Available to everyone - authenticated or not. ' +
          'If a valid JWT is present, the ticket is automatically linked to the user account. ' +
          'Password reset tickets cannot be created through this endpoint.',
      }),
      ApiBody({ type: CreateTicketDto }),
      ApiCreatedResponse({
        description: 'Ticket submitted successfully.',
        type: TicketDto,
      }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  // GET /tickets
  FindAll: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'List tickets',
        description:
          'Authenticated users see only their own tickets. ' +
          'Employees see all tickets. ' +
          'Password reset tickets are always excluded from this listing.',
      }),
      ApiExtraModels(PaginatedDto, TicketDto),
      ApiOkResponse({
        description: 'Paginated list of tickets.',
        schema: PaginatedDtoSchemaDoc(TicketDto),
      }),
      ApiBadRequestResponse({ description: 'Invalid pagination parameters.' }),
    ),

  // GET /tickets/:id
  FindOne: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Get a ticket by ID',
        description:
          'Returns a single ticket. ' +
          'Regular users can only access their own tickets. ' +
          'Employees can access any ticket.',
      }),
      TICKET_ID_PARAM,
      ApiOkResponse({ description: 'Ticket found.', type: TicketDto }),
      ApiNotFoundResponse({ description: 'Ticket not found.' }),
      ApiForbiddenResponse({
        description: 'Ticket belongs to another user.',
      }),
    ),

  // PATCH /tickets/:id
  Update: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Update ticket status',
        description: 'Employee only. Updates the status of a ticket.',
      }),
      TICKET_ID_PARAM,
      ApiBody({ type: UpdateTicketDto }),
      ApiOkResponse({ description: 'Ticket status updated.', type: TicketDto }),
      ApiNotFoundResponse({ description: 'Ticket not found.' }),
      ApiForbiddenResponse({ description: 'Insufficient permissions.' }),
      ApiBadRequestResponse({ description: 'Validation failed.' }),
    ),

  // DELETE /tickets/:id
  Remove: () =>
    applyDecorators(
      ApiAuth(),
      ApiOperation({
        summary: 'Delete a ticket',
        description: 'Employee only. Permanently deletes the ticket.',
      }),
      TICKET_ID_PARAM,
      ApiNoContentResponse({ description: 'Ticket deleted.' }),
      ApiNotFoundResponse({ description: 'Ticket not found.' }),
      ApiForbiddenResponse({ description: 'Insufficient permissions.' }),
    ),
};
