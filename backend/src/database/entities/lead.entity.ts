import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Company } from './company.entity';
import { Contact } from './contact.entity';
import { User } from './user.entity';

export enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  LOST = 'lost',
  WON = 'won',
}

export enum LeadSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_CAMPAIGN = 'email_campaign',
  COLD_CALL = 'cold_call',
  TRADE_SHOW = 'trade_show',
  OTHER = 'other',
}

@Entity('leads')
@Index(['tenantId'])
@Index(['companyId'])
@Index(['contactId'])
@Index(['status'])
@Index(['ownerUserId'])
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  contactId: string;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @Column({ type: 'enum', enum: LeadSource, default: LeadSource.OTHER })
  source: LeadSource;

  @Column({ type: 'int', nullable: true })
  score: number;

  @Column({ type: 'uuid', nullable: true })
  ownerUserId: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => Company, (company) => company.leads, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Contact, (contact) => contact.leads, { nullable: true })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerUserId' })
  ownerUser: User;
}
