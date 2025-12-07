import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { PosSession } from './pos-session.entity';
import { Contact } from './contact.entity';

export enum PosPaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK = 'bank',
  CHECK = 'check',
  OTHER = 'other',
}

@Entity('pos_transactions')
@Index(['sessionId'])
@Index(['receiptNumber'], { unique: true })
@Index(['companyId'])
export class PosTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => PosSession, (session) => session.transactions)
  @JoinColumn({ name: 'session_id' })
  session: PosSession;

  @Column({ name: 'receipt_number', type: 'varchar', length: 100, unique: true })
  receiptNumber: string;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId: string | null;

  @Column({ type: 'jsonb' })
  items: Record<string, any>[]; // Array of {productId, name, quantity, unitPrice, subtotal}

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PosPaymentMethod,
    default: PosPaymentMethod.CASH,
  })
  paymentMethod: PosPaymentMethod;

  @Column({ name: 'change_given', type: 'decimal', precision: 15, scale: 2, default: 0 })
  changeGiven: number;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string | null;

  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Contact | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
