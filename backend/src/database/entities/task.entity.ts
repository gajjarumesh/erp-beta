import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Project } from './project.entity';
import { User } from './user.entity';
import { TaskComment } from './task-comment.entity';
import { Timesheet } from './timesheet.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  BLOCKED = 'blocked',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tasks')
@Index(['tenantId'])
@Index(['projectId', 'status'])
@Index(['assigneeUserId'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  assigneeUserId: string;

  @Column({ 
    type: 'enum', 
    enum: TaskStatus, 
    default: TaskStatus.TODO 
  })
  status: TaskStatus;

  @Column({ 
    type: 'enum', 
    enum: TaskPriority, 
    default: TaskPriority.MEDIUM 
  })
  priority: TaskPriority;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimateHours: number;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

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

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigneeUserId' })
  assignee: User;

  @OneToMany(() => TaskComment, (comment) => comment.task)
  comments: TaskComment[];

  @OneToMany(() => Timesheet, (timesheet) => timesheet.task)
  timesheets: Timesheet[];
}
