import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { WorkflowRule } from './workflow-rule.entity';

export enum WorkflowLogStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  RETRY = 'retry',
}

@Entity('workflow_logs')
@Index(['workflowId'])
@Index(['status'])
@Index(['runAt'])
export class WorkflowLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workflow_id', type: 'uuid' })
  workflowId: string;

  @ManyToOne(() => WorkflowRule, (workflow) => workflow.logs)
  @JoinColumn({ name: 'workflow_id' })
  workflow: WorkflowRule;

  @Column({
    type: 'enum',
    enum: WorkflowLogStatus,
    default: WorkflowLogStatus.PENDING,
  })
  status: WorkflowLogStatus;

  @Column({ name: 'run_at', type: 'timestamp' })
  runAt: Date;

  @Column({ name: 'input_snapshot', type: 'jsonb', nullable: true })
  inputSnapshot: Record<string, any> | null; // Snapshot of entity data that triggered workflow

  @Column({ name: 'output_snapshot', type: 'jsonb', nullable: true })
  outputSnapshot: Record<string, any> | null; // Result of actions executed

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'execution_time', type: 'int', nullable: true })
  executionTime: number | null; // Milliseconds

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
