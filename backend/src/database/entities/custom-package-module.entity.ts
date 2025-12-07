import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn } from 'typeorm';
import { CustomPackage } from './custom-package.entity';
import { ModulesCatalog } from './modules-catalog.entity';

@Entity('custom_package_modules')
@Index(['packageId'])
@Index(['moduleId'])
export class CustomPackageModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  packageId: string;

  @Column({ type: 'uuid' })
  moduleId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtPurchase: number; // Store price at time of selection

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // For upgrade/downgrade scenarios

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CustomPackage, (pkg) => pkg.modules)
  @JoinColumn({ name: 'packageId' })
  package: CustomPackage;

  @ManyToOne(() => ModulesCatalog)
  @JoinColumn({ name: 'moduleId' })
  module: ModulesCatalog;
}
