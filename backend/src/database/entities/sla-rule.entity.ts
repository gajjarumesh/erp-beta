import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Ticket } from './ticket.entity';

@Entity('sla_rules')
@Index(['tenantId'])
export class SlaRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  targetResponseMinutes: number;

  @Column({ type: 'integer' })
  targetResolutionMinutes: number;

  @Column({ type: 'jsonb', nullable: true })
  applicablePriorities: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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

  @OneToMany(() => Ticket, (ticket) => ticket.slaRule)
  tickets: Ticket[];
}
