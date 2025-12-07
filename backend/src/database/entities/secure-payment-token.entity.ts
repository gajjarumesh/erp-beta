import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  OTHER = 'other',
}

@Entity('secure_payment_tokens')
@Index(['tenantId'])
@Index(['userId'])
@Index(['gateway'])
export class SecurePaymentToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ 
    type: 'enum', 
    enum: PaymentGateway 
  })
  gateway: PaymentGateway;

  @Column({ type: 'text' })
  encryptedToken: string; // Encrypted payment token/card details

  @Column({ type: 'text' })
  encryptionKeyId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  maskedCardNumber: string; // e.g., "****1234"

  @Column({ type: 'varchar', length: 50, nullable: true })
  cardType: string; // visa, mastercard, etc.

  @Column({ type: 'varchar', length: 10, nullable: true })
  expiryMonth: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  expiryYear: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'boolean', default: false })
  autoDebitEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
