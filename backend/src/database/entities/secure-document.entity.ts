import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

export enum DocumentType {
  REGISTRATION_CERTIFICATE = 'registration_certificate',
  TAX_DOCUMENT = 'tax_document',
  LEGAL_AGREEMENT = 'legal_agreement',
  IDENTITY_PROOF = 'identity_proof',
  ADDRESS_PROOF = 'address_proof',
  OTHER = 'other',
}

@Entity('secure_documents')
@Index(['tenantId'])
@Index(['userId'])
@Index(['documentType'])
export class SecureDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ 
    type: 'enum', 
    enum: DocumentType 
  })
  documentType: DocumentType;

  @Column({ type: 'varchar', length: 500 })
  documentName: string;

  @Column({ type: 'text' })
  encryptedS3Key: string; // Encrypted S3 object key

  @Column({ type: 'text' })
  encryptedContent: string; // Encrypted file content (or reference)

  @Column({ type: 'text' })
  encryptionKeyId: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  sizeBytes: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  checksum: string; // For integrity verification

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

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
