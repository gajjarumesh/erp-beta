import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { WorkflowLog } from './workflow-log.entity';

@Entity('workflow_rules')
@Index(['tenantId'])
@Index(['isActive'])
export class WorkflowRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb' })
  trigger: Record<string, any>; // {type: "on_create|on_update|on_delete|schedule|webhook", entity: "invoice", config: {...}}

  @Column({ type: 'jsonb' })
  conditions: Record<string, any>; // JSON-based conditions: {field: "due_date", operator: "<", value: "now"}

  @Column({ type: 'jsonb' })
  actions: Record<string, any>[]; // Array of actions: [{type: "send_email", config: {...}}]

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'runs_count', type: 'int', default: 0 })
  runsCount: number;

  @Column({ name: 'last_run_at', type: 'timestamp', nullable: true })
  lastRunAt: Date | null;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User | null;

  @OneToMany(() => WorkflowLog, (log) => log.workflow)
  logs: WorkflowLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
