import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { PosTransaction } from './pos-transaction.entity';

export enum PosSessionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity('pos_sessions')
@Index(['tenantId'])
@Index(['openedByUserId'])
@Index(['status'])
export class PosSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId: string | null;

  @ManyToOne(() => Tenant, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant | null;

  @Column({ name: 'opened_by_user_id', type: 'uuid' })
  openedByUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'opened_by_user_id' })
  openedByUser: User;

  @Column({ name: 'opened_at', type: 'timestamp' })
  openedAt: Date;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date | null;

  @Column({ name: 'opening_balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
  openingBalance: number;

  @Column({ name: 'closing_balance', type: 'decimal', precision: 15, scale: 2, nullable: true })
  closingBalance: number | null;

  @Column({
    type: 'enum',
    enum: PosSessionStatus,
    default: PosSessionStatus.OPEN,
  })
  status: PosSessionStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => PosTransaction, (transaction) => transaction.session)
  transactions: PosTransaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
