import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum LimitType {
  USERS = 'users',
  STORAGE_GB = 'storage_gb',
  TRANSACTIONS = 'transactions',
  RECORDS = 'records',
  API_CALLS = 'api_calls',
}

@Entity('limit_types_catalog')
export class LimitTypesCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string; // e.g., 'users', 'storage_gb'

  @Column({ 
    type: 'enum', 
    enum: LimitType 
  })
  type: LimitType;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  unit: string; // e.g., 'users', 'GB', 'transactions/month'

  @Column({ type: 'int' })
  defaultLimit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerUnit: number; // Price per additional unit beyond default

  @Column({ type: 'int', default: 1 })
  incrementStep: number; // Minimum increment (e.g., 5 users at a time)

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
