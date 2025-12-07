import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { User } from './user.entity';
import { AuditLog } from './audit-log.entity';
import { Settings } from './settings.entity';
import { File } from './file.entity';
import { Notification } from './notification.entity';

@Entity('tenants')
@Index(['slug'], { unique: true })
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 50, default: 'free' })
  plan: string;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Theme settings
  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string;

  @Column({ type: 'varchar', length: 7, default: '#3B82F6' })
  primaryColor: string;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  locale: string;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => AuditLog, (log) => log.tenant)
  auditLogs: AuditLog[];

  @OneToMany(() => Settings, (settings) => settings.tenant)
  settings: Settings[];

  @OneToMany(() => File, (file) => file.tenant)
  files: File[];

  @OneToMany(() => Notification, (notification) => notification.tenant)
  notifications: Notification[];
}
