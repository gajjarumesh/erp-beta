import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tenant } from './tenant.entity';
import { CustomPackage } from './custom-package.entity';

export enum Phase7SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  GRACE_PERIOD = 'grace_period',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum PaymentCycle {
  YEARLY = 'yearly',
}

@Entity('phase7_subscriptions')
@Index(['tenantId'])
@Index(['customPackageId'])
@Index(['status'])
@Index(['renewalDate'])
export class Phase7Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  customPackageId: string;

  @Column({ 
    type: 'enum', 
    enum: Phase7SubscriptionStatus,
    default: Phase7SubscriptionStatus.TRIAL
  })
  status: Phase7SubscriptionStatus;

  @Column({ 
    type: 'enum', 
    enum: PaymentCycle,
    default: PaymentCycle.YEARLY
  })
  billingCycle: PaymentCycle;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  yearlyAmount: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  renewalDate: Date; // Next renewal date

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt: Date;

  @Column({ type: 'int', default: 7 })
  gracePeriodDays: number; // Configurable grace period

  @Column({ type: 'boolean', default: false })
  autoRenewalEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  razorpaySubscriptionId: string; // Razorpay subscription ID

  @Column({ type: 'varchar', length: 255, nullable: true })
  razorpayCustomerId: string;

  @Column({ type: 'jsonb', nullable: true })
  razorpayData: any; // Additional Razorpay data

  @Column({ type: 'timestamp', nullable: true })
  lastRenewalAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastReminderSentAt: Date;

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

  @ManyToOne(() => CustomPackage)
  @JoinColumn({ name: 'customPackageId' })
  customPackage: CustomPackage;
}
