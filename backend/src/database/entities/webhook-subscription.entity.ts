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
import { Integration } from './integration.entity';

@Entity('webhook_subscriptions')
@Index(['tenantId'])
@Index(['integrationId'])
@Index(['isActive'])
export class WebhookSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'integration_id', nullable: true })
  integrationId: string;

  @ManyToOne(() => Integration, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'integration_id' })
  integration: Integration;

  @Column({ name: 'target_url' })
  targetUrl: string;

  @Column({ type: 'jsonb', default: [] })
  events: string[];

  @Column()
  secret: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
