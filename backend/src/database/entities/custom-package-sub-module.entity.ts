import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn } from 'typeorm';
import { CustomPackage } from './custom-package.entity';
import { SubModulesCatalog } from './sub-modules-catalog.entity';

@Entity('custom_package_sub_modules')
@Index(['packageId'])
@Index(['subModuleId'])
export class CustomPackageSubModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  packageId: string;

  @Column({ type: 'uuid' })
  subModuleId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtPurchase: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CustomPackage, (pkg) => pkg.subModules)
  @JoinColumn({ name: 'packageId' })
  package: CustomPackage;

  @ManyToOne(() => SubModulesCatalog)
  @JoinColumn({ name: 'subModuleId' })
  subModule: SubModulesCatalog;
}
