import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Employee } from './employee.entity';
import { User } from './user.entity';

export enum PayslipStatus {
  DRAFT = 'draft',
  PROCESSED = 'processed',
  PAID = 'paid',
}

@Entity('payslips')
@Index(['tenantId'])
@Index(['employeeId', 'periodStart', 'periodEnd'])
export class Payslip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  gross: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  net: number;

  @Column({ type: 'jsonb' })
  breakdown: {
    baseSalary: number;
    allowances: Array<{ name: string; amount: number }>;
    deductions: Array<{ name: string; amount: number }>;
    taxes: Array<{ name: string; amount: number }>;
  };

  @Column({ 
    type: 'enum', 
    enum: PayslipStatus, 
    default: PayslipStatus.DRAFT 
  })
  status: PayslipStatus;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'uuid', nullable: true })
  processedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

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

  @ManyToOne(() => Employee, (employee) => employee.payslips)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'processedBy' })
  processor: User;
}
