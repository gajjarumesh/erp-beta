import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';

export enum IntegrationType {
  STRIPE = 'stripe',
  RAZORPAY = 'razorpay',
  SENDGRID = 'sendgrid',
  SES = 'ses',
  TWILIO = 'twilio',
  SHOPIFY = 'shopify',
  DOCUSIGN = 'docusign',
  CUSTOM = 'custom',
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

@Entity('integrations')
@Index(['tenantId'])
@Index(['type'])
@Index(['status'])
export class Integration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({
    type: 'varchar',
    enum: IntegrationType,
  })
  type: IntegrationType;

  @Column()
  name: string;

  @Column({ type: 'jsonb', default: {} })
  config: Record<string, any>;

  @Column({
    type: 'varchar',
    enum: IntegrationStatus,
    default: IntegrationStatus.INACTIVE,
  })
  status: IntegrationStatus;

  @Column({ name: 'last_tested_at', type: 'timestamp', nullable: true })
  lastTestedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
