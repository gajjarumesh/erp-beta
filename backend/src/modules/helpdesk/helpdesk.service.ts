import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { 
  Ticket, 
  TicketComment, 
  SlaRule,
  TicketStatus,
  TicketPriority 
} from '../../database/entities';
import {
  CreateSlaRuleDto,
  UpdateSlaRuleDto,
  CreateTicketDto,
  UpdateTicketDto,
  AssignTicketDto,
  CreateTicketCommentDto,
} from './dto';

@Injectable()
export class HelpdeskService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(TicketComment)
    private ticketCommentsRepository: Repository<TicketComment>,
    @InjectRepository(SlaRule)
    private slaRulesRepository: Repository<SlaRule>,
  ) {}

  // ===========================
  // SLA RULE METHODS
  // ===========================

  async createSlaRule(tenantId: string, dto: CreateSlaRuleDto): Promise<SlaRule> {
    const slaRule = this.slaRulesRepository.create({
      ...dto,
      tenantId,
    });

    return this.slaRulesRepository.save(slaRule);
  }

  async findAllSlaRules(tenantId: string): Promise<SlaRule[]> {
    return this.slaRulesRepository.find({
      where: { tenantId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneSlaRule(id: string): Promise<SlaRule> {
    const slaRule = await this.slaRulesRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!slaRule) {
      throw new NotFoundException('SLA rule not found');
    }

    return slaRule;
  }

  async updateSlaRule(id: string, dto: UpdateSlaRuleDto): Promise<SlaRule> {
    const slaRule = await this.findOneSlaRule(id);
    Object.assign(slaRule, dto);
    return this.slaRulesRepository.save(slaRule);
  }

  async removeSlaRule(id: string): Promise<void> {
    const slaRule = await this.findOneSlaRule(id);
    slaRule.deletedAt = new Date();
    await this.slaRulesRepository.save(slaRule);
  }

  // ===========================
  // TICKET METHODS
  // ===========================

  private generateTicketNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TKT-${timestamp}-${random}`;
  }

  private async applySlaRules(ticket: Ticket): Promise<void> {
    // Find applicable SLA rule
    const slaRules = await this.slaRulesRepository.find({
      where: { 
        tenantId: ticket.tenantId, 
        isActive: true,
        deletedAt: IsNull() 
      },
    });

    // Find the first matching SLA rule
    const applicableRule = slaRules.find(rule => {
      if (!rule.applicablePriorities || rule.applicablePriorities.length === 0) {
        return true; // Applies to all priorities
      }
      return rule.applicablePriorities.includes(ticket.priority);
    });

    if (applicableRule) {
      ticket.slaRuleId = applicableRule.id;
      const createdAt = new Date(ticket.createdAt);
      ticket.slaResponseDeadline = new Date(
        createdAt.getTime() + applicableRule.targetResponseMinutes * 60 * 1000
      );
      ticket.slaResolutionDeadline = new Date(
        createdAt.getTime() + applicableRule.targetResolutionMinutes * 60 * 1000
      );
    }
  }

  async createTicket(tenantId: string, dto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({
      ...dto,
      tenantId,
      ticketNumber: this.generateTicketNumber(),
      status: TicketStatus.NEW,
    });

    const savedTicket = await this.ticketsRepository.save(ticket);

    // Apply SLA rules
    await this.applySlaRules(savedTicket);
    await this.ticketsRepository.save(savedTicket);

    return this.findOneTicket(savedTicket.id);
  }

  async findAllTickets(
    tenantId: string,
    status?: TicketStatus,
    priority?: TicketPriority,
    assigneeUserId?: string,
    slaBreached?: boolean,
  ): Promise<Ticket[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (assigneeUserId) {
      where.assigneeUserId = assigneeUserId;
    }

    // For SLA breached, we need additional query logic
    // Simplified for now

    return this.ticketsRepository.find({
      where,
      relations: ['company', 'contact', 'assignee', 'slaRule'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneTicket(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['company', 'contact', 'assignee', 'slaRule', 'comments', 'comments.author'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check and update SLA breach status
    const now = new Date();
    if (ticket.slaResponseDeadline && !ticket.firstResponseAt && now > ticket.slaResponseDeadline) {
      ticket.slaResponseBreached = true;
    }
    if (ticket.slaResolutionDeadline && !ticket.resolvedAt && now > ticket.slaResolutionDeadline) {
      ticket.slaResolutionBreached = true;
    }

    return ticket;
  }

  async updateTicket(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOneTicket(id);
    Object.assign(ticket, dto);
    return this.ticketsRepository.save(ticket);
  }

  async assignTicket(id: string, dto: AssignTicketDto): Promise<Ticket> {
    const ticket = await this.findOneTicket(id);
    ticket.assigneeUserId = dto.assigneeUserId;
    
    if (ticket.status === TicketStatus.NEW) {
      ticket.status = TicketStatus.OPEN;
    }
    
    return this.ticketsRepository.save(ticket);
  }

  async resolveTicket(id: string): Promise<Ticket> {
    const ticket = await this.findOneTicket(id);
    ticket.status = TicketStatus.RESOLVED;
    ticket.resolvedAt = new Date();
    return this.ticketsRepository.save(ticket);
  }

  async closeTicket(id: string): Promise<Ticket> {
    const ticket = await this.findOneTicket(id);
    
    if (ticket.status !== TicketStatus.RESOLVED) {
      throw new BadRequestException('Can only close resolved tickets');
    }
    
    ticket.status = TicketStatus.CLOSED;
    ticket.closedAt = new Date();
    return this.ticketsRepository.save(ticket);
  }

  async removeTicket(id: string): Promise<void> {
    const ticket = await this.findOneTicket(id);
    ticket.deletedAt = new Date();
    await this.ticketsRepository.save(ticket);
  }

  // ===========================
  // TICKET COMMENT METHODS
  // ===========================

  async createTicketComment(
    ticketId: string,
    authorUserId: string,
    tenantId: string,
    dto: CreateTicketCommentDto,
  ): Promise<TicketComment> {
    const ticket = await this.findOneTicket(ticketId);

    // Mark first response if this is the first comment from staff
    if (!ticket.firstResponseAt && !dto.isInternal) {
      ticket.firstResponseAt = new Date();
      await this.ticketsRepository.save(ticket);
    }

    const comment = this.ticketCommentsRepository.create({
      ...dto,
      tenantId,
      ticketId,
      authorUserId,
    });

    return this.ticketCommentsRepository.save(comment);
  }

  async findTicketComments(ticketId: string, includeInternal: boolean = true): Promise<TicketComment[]> {
    const where: any = { ticketId, deletedAt: IsNull() };
    
    if (!includeInternal) {
      where.isInternal = false;
    }

    return this.ticketCommentsRepository.find({
      where,
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }
}
