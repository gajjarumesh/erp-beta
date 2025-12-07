import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Employee } from './employee.entity';
import { Project } from './project.entity';
import { Task } from './task.entity';

@Entity('timesheets')
@Index(['tenantId'])
@Index(['employeeId', 'date'])
@Index(['projectId', 'date'])
export class Timesheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid', nullable: true })
  taskId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hours: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  billable: boolean;

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

  @ManyToOne(() => Employee, (employee) => employee.timesheets)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @ManyToOne(() => Project, (project) => project.timesheets)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => Task, (task) => task.timesheets, { nullable: true })
  @JoinColumn({ name: 'taskId' })
  task: Task;
}
