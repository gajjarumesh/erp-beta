import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Entity('files')
@Index(['tenantId'])
@Index(['createdByUserId'])
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 500 })
  path: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'uuid' })
  createdByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Tenant, (tenant) => tenant.files)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;
}
