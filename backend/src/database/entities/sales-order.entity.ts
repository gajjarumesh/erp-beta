import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Company } from './company.entity';
import { Contact } from './contact.entity';
import { SalesOrderLine } from './sales-order-line.entity';

export enum SalesOrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  INVOICED = 'invoiced',
  CANCELLED = 'cancelled',
}

@Entity('sales_orders')
@Index(['tenantId'])
@Index(['companyId'])
@Index(['orderNumber'], { unique: true })
@Index(['status'])
export class SalesOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  contactId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @Column({ type: 'enum', enum: SalesOrderStatus, default: SalesOrderStatus.DRAFT })
  status: SalesOrderStatus;

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

  @ManyToOne(() => Company, (company) => company.salesOrders)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Contact, (contact) => contact.salesOrders, { nullable: true })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @OneToMany(() => SalesOrderLine, (line) => line.salesOrder, { cascade: true })
  lines: SalesOrderLine[];
}
