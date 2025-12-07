import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Employee } from './employee.entity';

export enum AttendanceSource {
  WEB = 'web',
  MOBILE = 'mobile',
  DEVICE = 'device',
}

@Entity('attendance_logs')
@Index(['tenantId'])
@Index(['employeeId', 'clockIn'])
export class AttendanceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @Column({ type: 'timestamp' })
  clockIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOut: Date;

  @Column({ 
    type: 'enum', 
    enum: AttendanceSource, 
    default: AttendanceSource.WEB 
  })
  source: AttendanceSource;

  @Column({ type: 'text', nullable: true })
  notes: string;

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

  @ManyToOne(() => Employee, (employee) => employee.attendanceLogs)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
