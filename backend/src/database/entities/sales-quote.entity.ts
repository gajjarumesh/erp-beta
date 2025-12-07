import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Company } from './company.entity';
import { Contact } from './contact.entity';
import { SalesQuoteLine } from './sales-quote-line.entity';

export enum SalesQuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('sales_quotes')
@Index(['tenantId'])
@Index(['companyId'])
@Index(['quoteNumber'], { unique: true })
@Index(['status'])
export class SalesQuote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  contactId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  quoteNumber: string;

  @Column({ type: 'enum', enum: SalesQuoteStatus, default: SalesQuoteStatus.DRAFT })
  status: SalesQuoteStatus;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

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

  @ManyToOne(() => Company, (company) => company.salesQuotes)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Contact, (contact) => contact.salesQuotes, { nullable: true })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @OneToMany(() => SalesQuoteLine, (line) => line.salesQuote, { cascade: true })
  lines: SalesQuoteLine[];
}
