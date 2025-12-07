import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { SalesQuote } from './sales-quote.entity';
import { Product } from './product.entity';

@Entity('sales_quote_lines')
@Index(['tenantId'])
@Index(['quoteId'])
@Index(['productId'])
export class SalesQuoteLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  quoteId: string;

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

  @ManyToOne(() => SalesQuote, (quote) => quote.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quoteId' })
  salesQuote: SalesQuote;

  @ManyToOne(() => Product, (product) => product.salesQuoteLines, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
