import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Entity('audit_logs')
@Index(['tenantId'])
@Index(['actorUserId'])
@Index(['objectType'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  actorUserId: string;

  @Column({ type: 'varchar', length: 50 })
  action: string; // create, update, delete, login, etc.

  @Column({ type: 'varchar', length: 100 })
  objectType: string; // tenant, user, role, settings, etc.

  @Column({ type: 'uuid', nullable: true })
  objectId: string;

  @Column({ type: 'jsonb', nullable: true })
  before: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  after: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Tenant, (tenant) => tenant.auditLogs)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: 'actorUserId' })
  actorUser: User;
}
