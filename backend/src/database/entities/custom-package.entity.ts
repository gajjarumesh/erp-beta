import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Tenant } from './tenant.entity';
import { CustomPackageModule } from './custom-package-module.entity';
import { CustomPackageSubModule } from './custom-package-sub-module.entity';
import { CustomPackageLimit } from './custom-package-limit.entity';

export enum PackageStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

@Entity('custom_packages')
@Index(['tenantId'])
@Index(['status'])
export class CustomPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalYearlyPrice: number;

  @Column({ 
    type: 'enum', 
    enum: PackageStatus, 
    default: PackageStatus.DRAFT 
  })
  status: PackageStatus;

  @Column({ type: 'timestamp', nullable: true })
  activatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Additional package metadata

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

  @OneToMany(() => CustomPackageModule, (module) => module.package)
  modules: CustomPackageModule[];

  @OneToMany(() => CustomPackageSubModule, (subModule) => subModule.package)
  subModules: CustomPackageSubModule[];

  @OneToMany(() => CustomPackageLimit, (limit) => limit.package)
  limits: CustomPackageLimit[];
}
