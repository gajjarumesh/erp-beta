import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Plugin } from './plugin.entity';

@Entity('plugin_configs')
@Index(['pluginKey'])
@Index(['tenantId'])
@Index(['isEnabled'])
@Unique(['pluginKey', 'tenantId'])
export class PluginConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plugin_key' })
  pluginKey: string;

  @ManyToOne(() => Plugin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plugin_key', referencedColumnName: 'key' })
  plugin: Plugin;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'jsonb', default: {} })
  config: Record<string, any>;

  @Column({ name: 'is_enabled', default: false })
  isEnabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
