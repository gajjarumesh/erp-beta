import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Pipeline } from './pipeline.entity';
import { Opportunity } from './opportunity.entity';

@Entity('stages')
@Index(['tenantId'])
@Index(['pipelineId'])
export class Stage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  pipelineId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: false })
  isWon: boolean;

  @Column({ type: 'boolean', default: false })
  isLost: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => Pipeline, (pipeline) => pipeline.stages)
  @JoinColumn({ name: 'pipelineId' })
  pipeline: Pipeline;

  @OneToMany(() => Opportunity, (opportunity) => opportunity.stage)
  opportunities: Opportunity[];
}
