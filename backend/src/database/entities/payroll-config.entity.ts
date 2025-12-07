import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Employee } from './employee.entity';

export enum PayrollCycle {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('payroll_configs')
@Index(['tenantId'])
@Index(['employeeId'])
export class PayrollConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  baseSalary: number;

  @Column({ type: 'jsonb', nullable: true })
  allowances: Array<{ name: string; amount: number; type: 'fixed' | 'percentage' }>;

  @Column({ type: 'jsonb', nullable: true })
  deductions: Array<{ name: string; amount: number; type: 'fixed' | 'percentage' }>;

  @Column({ 
    type: 'enum', 
    enum: PayrollCycle, 
    default: PayrollCycle.MONTHLY 
  })
  cycle: PayrollCycle;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

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

  @ManyToOne(() => Employee, (employee) => employee.payrollConfigs)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
