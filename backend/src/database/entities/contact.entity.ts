import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Company } from './company.entity';
import { Lead } from './lead.entity';
import { Opportunity } from './opportunity.entity';
import { SalesQuote } from './sales-quote.entity';
import { SalesOrder } from './sales-order.entity';

@Entity('contacts')
@Index(['tenantId'])
@Index(['companyId'])
@Index(['email'])
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  role: string;

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

  @ManyToOne(() => Company, (company) => company.contacts, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => Lead, (lead) => lead.contact)
  leads: Lead[];

  @OneToMany(() => Opportunity, (opportunity) => opportunity.contact)
  opportunities: Opportunity[];

  @OneToMany(() => SalesQuote, (quote) => quote.contact)
  salesQuotes: SalesQuote[];

  @OneToMany(() => SalesOrder, (order) => order.contact)
  salesOrders: SalesOrder[];
}
