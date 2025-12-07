import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HelpdeskService } from './helpdesk.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import {
  CreateSlaRuleDto,
  UpdateSlaRuleDto,
  CreateTicketDto,
  UpdateTicketDto,
  AssignTicketDto,
  CreateTicketCommentDto,
} from './dto';
import { TicketStatus, TicketPriority } from '../../database/entities';

@ApiTags('Helpdesk & Tickets')
@ApiBearerAuth()
@Controller('helpdesk')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HelpdeskController {
  constructor(private readonly helpdeskService: HelpdeskService) {}

  // ===========================
  // SLA RULE ENDPOINTS
  // ===========================

  @Post('sla-rules')
  @ApiOperation({ summary: 'Create SLA rule' })
  @RequirePermissions('helpdesk:sla:create')
  async createSlaRule(@Request() req, @Body() dto: CreateSlaRuleDto) {
    return this.helpdeskService.createSlaRule(req.user.tenantId, dto);
  }

  @Get('sla-rules')
  @ApiOperation({ summary: 'Get all SLA rules' })
  @RequirePermissions('helpdesk:sla:read')
  async findAllSlaRules(@Request() req) {
    return this.helpdeskService.findAllSlaRules(req.user.tenantId);
  }

  @Get('sla-rules/:id')
  @ApiOperation({ summary: 'Get SLA rule by ID' })
  @RequirePermissions('helpdesk:sla:read')
  async findOneSlaRule(@Param('id') id: string) {
    return this.helpdeskService.findOneSlaRule(id);
  }

  @Put('sla-rules/:id')
  @ApiOperation({ summary: 'Update SLA rule' })
  @RequirePermissions('helpdesk:sla:update')
  async updateSlaRule(@Param('id') id: string, @Body() dto: UpdateSlaRuleDto) {
    return this.helpdeskService.updateSlaRule(id, dto);
  }

  @Delete('sla-rules/:id')
  @ApiOperation({ summary: 'Delete SLA rule' })
  @RequirePermissions('helpdesk:sla:delete')
  async removeSlaRule(@Param('id') id: string) {
    await this.helpdeskService.removeSlaRule(id);
    return { message: 'SLA rule deleted successfully' };
  }

  // ===========================
  // TICKET ENDPOINTS
  // ===========================

  @Post('tickets')
  @ApiOperation({ summary: 'Create ticket' })
  @RequirePermissions('helpdesk:ticket:create')
  async createTicket(@Request() req, @Body() dto: CreateTicketDto) {
    return this.helpdeskService.createTicket(req.user.tenantId, dto);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'Get all tickets with filters' })
  @RequirePermissions('helpdesk:ticket:read')
  async findAllTickets(
    @Request() req,
    @Query('status') status?: TicketStatus,
    @Query('priority') priority?: TicketPriority,
    @Query('assigneeUserId') assigneeUserId?: string,
    @Query('slaBreached') slaBreached?: boolean,
  ) {
    return this.helpdeskService.findAllTickets(
      req.user.tenantId,
      status,
      priority,
      assigneeUserId,
      slaBreached,
    );
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @RequirePermissions('helpdesk:ticket:read')
  async findOneTicket(@Param('id') id: string) {
    return this.helpdeskService.findOneTicket(id);
  }

  @Put('tickets/:id')
  @ApiOperation({ summary: 'Update ticket' })
  @RequirePermissions('helpdesk:ticket:update')
  async updateTicket(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.helpdeskService.updateTicket(id, dto);
  }

  @Post('tickets/:id/assign')
  @ApiOperation({ summary: 'Assign ticket to user' })
  @RequirePermissions('helpdesk:ticket:assign')
  async assignTicket(@Param('id') id: string, @Body() dto: AssignTicketDto) {
    return this.helpdeskService.assignTicket(id, dto);
  }

  @Post('tickets/:id/resolve')
  @ApiOperation({ summary: 'Mark ticket as resolved' })
  @RequirePermissions('helpdesk:ticket:update')
  async resolveTicket(@Param('id') id: string) {
    return this.helpdeskService.resolveTicket(id);
  }

  @Post('tickets/:id/close')
  @ApiOperation({ summary: 'Close ticket' })
  @RequirePermissions('helpdesk:ticket:update')
  async closeTicket(@Param('id') id: string) {
    return this.helpdeskService.closeTicket(id);
  }

  @Delete('tickets/:id')
  @ApiOperation({ summary: 'Delete ticket' })
  @RequirePermissions('helpdesk:ticket:delete')
  async removeTicket(@Param('id') id: string) {
    await this.helpdeskService.removeTicket(id);
    return { message: 'Ticket deleted successfully' };
  }

  // ===========================
  // TICKET COMMENT ENDPOINTS
  // ===========================

  @Post('tickets/:ticketId/comments')
  @ApiOperation({ summary: 'Add comment to ticket' })
  @RequirePermissions('helpdesk:ticket:update')
  async createTicketComment(
    @Request() req,
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateTicketCommentDto,
  ) {
    return this.helpdeskService.createTicketComment(
      ticketId,
      req.user.id,
      req.user.tenantId,
      dto,
    );
  }

  @Get('tickets/:ticketId/comments')
  @ApiOperation({ summary: 'Get ticket comments' })
  @RequirePermissions('helpdesk:ticket:read')
  async findTicketComments(
    @Param('ticketId') ticketId: string,
    @Query('includeInternal') includeInternal?: boolean,
  ) {
    return this.helpdeskService.findTicketComments(
      ticketId,
      includeInternal !== false,
    );
  }
}
