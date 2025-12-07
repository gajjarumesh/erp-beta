import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

export enum IdentityDataType {
  GST = 'gst',
  PAN = 'pan',
  AADHAAR = 'aadhaar',
  TAX_ID = 'tax_id',
  SSN = 'ssn',
  OTHER = 'other',
}

@Entity('secure_identity_data')
@Index(['tenantId'])
@Index(['userId'])
@Index(['dataType'])
export class SecureIdentityData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string; // The user who owns this identity data

  @Column({ 
    type: 'enum', 
    enum: IdentityDataType 
  })
  dataType: IdentityDataType;

  @Column({ type: 'text' })
  encryptedData: string; // AES-256 encrypted data

  @Column({ type: 'text' })
  encryptionKeyId: string; // Reference to encryption key (never the key itself)

  @Column({ type: 'varchar', length: 100, nullable: true })
  verificationStatus: string; // 'verified', 'pending', 'failed'

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationReferenceId: string; // External verification service reference

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  maskedValue: string; // e.g., "****1234" for display only

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Non-sensitive metadata only

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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
