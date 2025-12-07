import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Company } from './company.entity';
import { Contact } from './contact.entity';
import { User } from './user.entity';
import { SlaRule } from './sla-rule.entity';
import { TicketComment } from './ticket-comment.entity';

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketStatus {
  NEW = 'new',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_CUSTOMER = 'waiting_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('tickets')
@Index(['tenantId'])
@Index(['companyId'])
@Index(['status', 'priority'])
@Index(['assigneeUserId'])
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  ticketNumber: string;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  contactId: string;

  @Column({ type: 'varchar', length: 500 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ 
    type: 'enum', 
    enum: TicketPriority, 
    default: TicketPriority.MEDIUM 
  })
  priority: TicketPriority;

  @Column({ 
    type: 'enum', 
    enum: TicketStatus, 
    default: TicketStatus.NEW 
  })
  status: TicketStatus;

  @Column({ type: 'uuid', nullable: true })
  assigneeUserId: string;

  @Column({ type: 'uuid', nullable: true })
  slaRuleId: string;

  @Column({ type: 'timestamp', nullable: true })
  firstResponseAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  slaResponseDeadline: Date;

  @Column({ type: 'timestamp', nullable: true })
  slaResolutionDeadline: Date;

  @Column({ type: 'boolean', default: false })
  slaResponseBreached: boolean;

  @Column({ type: 'boolean', default: false })
  slaResolutionBreached: boolean;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigneeUserId' })
  assignee: User;

  @ManyToOne(() => SlaRule, { nullable: true })
  @JoinColumn({ name: 'slaRuleId' })
  slaRule: SlaRule;

  @OneToMany(() => TicketComment, (comment) => comment.ticket)
  comments: TicketComment[];
}
