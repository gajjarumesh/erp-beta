import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { Invoice } from './invoice.entity';

export enum BankTransactionStatus {
  UNMATCHED = 'unmatched',
  MATCHED = 'matched',
  RECONCILED = 'reconciled',
}

@Entity('bank_transactions')
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bank_account_id', type: 'uuid' })
  bankAccountId: string;

  @ManyToOne(() => BankAccount, (account) => account.transactions)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string | null;

  @Column({
    type: 'enum',
    enum: BankTransactionStatus,
    default: BankTransactionStatus.UNMATCHED,
  })
  status: BankTransactionStatus;

  @Column({ name: 'matched_invoice_id', type: 'uuid', nullable: true })
  matchedInvoiceId: string | null;

  @ManyToOne(() => Invoice, { nullable: true })
  @JoinColumn({ name: 'matched_invoice_id' })
  matchedInvoice: Invoice | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
