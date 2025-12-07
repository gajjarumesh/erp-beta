import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { SavedReport } from './saved-report.entity';

@Entity('dashboard_widgets')
@Index(['userId'])
@Index(['isActive'])
export class DashboardWidget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: string; // chart, table, metric, list

  @Column({ type: 'jsonb' })
  config: Record<string, any>; // Widget configuration: data source, visualization settings

  @Column({ type: 'jsonb' })
  position: Record<string, any>; // {x: 0, y: 0, width: 4, height: 3}

  @Column({ name: 'report_slug', type: 'varchar', length: 100, nullable: true })
  reportSlug: string | null;

  @ManyToOne(() => SavedReport, { nullable: true })
  @JoinColumn({ name: 'report_slug', referencedColumnName: 'slug' })
  report: SavedReport | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
