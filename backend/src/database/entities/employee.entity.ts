import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { AttendanceLog } from './attendance-log.entity';
import { LeaveRequest } from './leave-request.entity';
import { ExpenseClaim } from './expense-claim.entity';
import { PayrollConfig } from './payroll-config.entity';
import { Payslip } from './payslip.entity';
import { Timesheet } from './timesheet.entity';

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
}

@Entity('employees')
@Index(['tenantId'])
@Index(['employeeCode'], { unique: true })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  employeeCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  department: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  designation: string;

  @Column({ type: 'date' })
  joiningDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  salary: {
    currency?: string;
    amount?: number;
    frequency?: 'hourly' | 'daily' | 'monthly' | 'yearly';
  };

  @Column({ 
    type: 'enum', 
    enum: EmployeeStatus, 
    default: EmployeeStatus.ACTIVE 
  })
  status: EmployeeStatus;

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => AttendanceLog, (log) => log.employee)
  attendanceLogs: AttendanceLog[];

  @OneToMany(() => LeaveRequest, (request) => request.employee)
  leaveRequests: LeaveRequest[];

  @OneToMany(() => ExpenseClaim, (claim) => claim.employee)
  expenseClaims: ExpenseClaim[];

  @OneToMany(() => PayrollConfig, (config) => config.employee)
  payrollConfigs: PayrollConfig[];

  @OneToMany(() => Payslip, (payslip) => payslip.employee)
  payslips: Payslip[];

  @OneToMany(() => Timesheet, (timesheet) => timesheet.employee)
  timesheets: Timesheet[];
}
