import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

export enum SettingsScope {
  TENANT = 'tenant',
  MODULE = 'module',
  USER = 'user',
}

@Entity('settings')
@Index(['tenantId', 'scope', 'key'], { unique: true })
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({
    type: 'enum',
    enum: SettingsScope,
    default: SettingsScope.TENANT,
  })
  scope: SettingsScope;

  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'jsonb' })
  value: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Tenant, (tenant) => tenant.settings)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
}
