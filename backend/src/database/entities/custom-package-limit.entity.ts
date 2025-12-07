import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CustomPackage } from './custom-package.entity';
import { LimitTypesCatalog } from './limit-types-catalog.entity';

@Entity('custom_package_limits')
@Index(['packageId'])
@Index(['limitTypeId'])
export class CustomPackageLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  packageId: string;

  @Column({ type: 'uuid' })
  limitTypeId: string;

  @Column({ type: 'int' })
  limitValue: number; // The actual limit value

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtPurchase: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CustomPackage, (pkg) => pkg.limits)
  @JoinColumn({ name: 'packageId' })
  package: CustomPackage;

  @ManyToOne(() => LimitTypesCatalog)
  @JoinColumn({ name: 'limitTypeId' })
  limitType: LimitTypesCatalog;
}
