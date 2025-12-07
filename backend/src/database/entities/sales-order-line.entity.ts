import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { SalesOrder } from './sales-order.entity';
import { Product } from './product.entity';

@Entity('sales_order_lines')
@Index(['tenantId'])
@Index(['orderId'])
@Index(['productId'])
export class SalesOrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'uuid', nullable: true })
  productId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

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

  @ManyToOne(() => SalesOrder, (order) => order.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  salesOrder: SalesOrder;

  @ManyToOne(() => Product, (product) => product.salesOrderLines, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
