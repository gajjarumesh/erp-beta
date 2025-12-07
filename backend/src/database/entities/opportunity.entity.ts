import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Company } from './company.entity';
import { Contact } from './contact.entity';
import { Pipeline } from './pipeline.entity';
import { Stage } from './stage.entity';

@Entity('opportunities')
@Index(['tenantId'])
@Index(['companyId'])
@Index(['pipelineId'])
@Index(['stageId'])
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  contactId: string;

  @Column({ type: 'uuid' })
  pipelineId: string;

  @Column({ type: 'uuid' })
  stageId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'int', nullable: true })
  probability: number;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate: Date;

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

  @ManyToOne(() => Company, (company) => company.opportunities)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Contact, (contact) => contact.opportunities, { nullable: true })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @ManyToOne(() => Pipeline, (pipeline) => pipeline.opportunities)
  @JoinColumn({ name: 'pipelineId' })
  pipeline: Pipeline;

  @ManyToOne(() => Stage, (stage) => stage.opportunities)
  @JoinColumn({ name: 'stageId' })
  stage: Stage;
}
