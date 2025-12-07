import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Contact } from './contact.entity';
import { Lead } from './lead.entity';
import { Opportunity } from './opportunity.entity';
import { SalesQuote } from './sales-quote.entity';
import { SalesOrder } from './sales-order.entity';

export enum CompanyType {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  BOTH = 'both',
}

@Entity('companies')
@Index(['tenantId'])
@Index(['name'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: CompanyType, default: CompanyType.CUSTOMER })
  type: CompanyType;

  @Column({ type: 'jsonb', nullable: true })
  taxIds: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  defaultCurrency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

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

  @OneToMany(() => Contact, (contact) => contact.company)
  contacts: Contact[];

  @OneToMany(() => Lead, (lead) => lead.company)
  leads: Lead[];

  @OneToMany(() => Opportunity, (opportunity) => opportunity.company)
  opportunities: Opportunity[];

  @OneToMany(() => SalesQuote, (quote) => quote.company)
  salesQuotes: SalesQuote[];

  @OneToMany(() => SalesOrder, (order) => order.company)
  salesOrders: SalesOrder[];
}
