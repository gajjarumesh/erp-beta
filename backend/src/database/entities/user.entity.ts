import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Role } from './role.entity';
import { AuditLog } from './audit-log.entity';
import { File } from './file.entity';
import { Notification } from './notification.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['tenantId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => AuditLog, (log) => log.actorUser)
  auditLogs: AuditLog[];

  @OneToMany(() => File, (file) => file.createdByUser)
  files: File[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
