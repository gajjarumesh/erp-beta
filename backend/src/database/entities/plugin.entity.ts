import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('plugins')
@Index(['key'], { unique: true })
@Index(['isEnabled'])
export class Plugin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  key: string;

  @Column()
  version: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'config_schema', type: 'jsonb', default: {} })
  configSchema: Record<string, any>;

  @Column({ name: 'is_enabled', default: false })
  isEnabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
