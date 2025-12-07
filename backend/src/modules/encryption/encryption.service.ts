import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Phase 7 - Zero-Access Encryption Service
 * 
 * CRITICAL SECURITY REQUIREMENTS:
 * 1. Per-user encryption keys
 * 2. In-memory decryption ONLY
 * 3. Super Admin has ZERO access to encrypted data
 * 4. Keys are never stored in plaintext
 * 5. Encryption happens client-side or in-memory only
 */

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly saltLength = 64;
  private readonly tagLength = 16;

  /**
   * Generate a new encryption key for a user
   * This should be called once per user and the key should be:
   * 1. Stored encrypted with user's password-derived key (client-side)
   * 2. OR stored in a secure key management service (HSM/KMS)
   * 3. NEVER stored in plaintext in database
   */
  generateEncryptionKey(): string {
    return crypto.randomBytes(this.keyLength).toString('base64');
  }

  /**
   * Derive a key from user password (for client-side key wrapping)
   * This allows users to "unlock" their encryption key with their password
   */
  deriveKeyFromPassword(password: string, salt?: string): { key: string; salt: string } {
    const actualSalt = salt || crypto.randomBytes(this.saltLength).toString('base64');
    const derivedKey = crypto.pbkdf2Sync(
      password,
      Buffer.from(actualSalt, 'base64'),
      100000, // iterations
      this.keyLength,
      'sha512'
    );
    return {
      key: derivedKey.toString('base64'),
      salt: actualSalt,
    };
  }

  /**
   * Encrypt data with AES-256-GCM
   * Returns: base64(iv + encrypted + authTag)
   * 
   * @param data - Plaintext data to encrypt
   * @param encryptionKey - Base64 encoded 256-bit key
   */
  encrypt(data: string, encryptionKey: string): string {
    try {
      const key = Buffer.from(encryptionKey, 'base64');
      const iv = crypto.randomBytes(this.ivLength);
      
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      
      let encrypted = cipher.update(data, 'utf8');
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      
      const authTag = cipher.getAuthTag();
      
      // Combine iv + encrypted + authTag
      const combined = Buffer.concat([iv, encrypted, authTag]);
      
      return combined.toString('base64');
    } catch (error) {
      this.logger.error('Encryption failed', error.stack);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt data encrypted with encrypt()
   * 
   * @param encryptedData - Base64 encoded encrypted data
   * @param encryptionKey - Base64 encoded 256-bit key
   * @returns Decrypted plaintext
   */
  decrypt(encryptedData: string, encryptionKey: string): string {
    try {
      const key = Buffer.from(encryptionKey, 'base64');
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extract iv, encrypted data, and authTag
      const iv = combined.subarray(0, this.ivLength);
      const authTag = combined.subarray(combined.length - this.tagLength);
      const encrypted = combined.subarray(this.ivLength, combined.length - this.tagLength);
      
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      this.logger.error('Decryption failed', error.stack);
      throw new UnauthorizedException('Invalid encryption key or corrupted data');
    }
  }

  /**
   * Hash data for storage (one-way, for verification only)
   * Used for masked values like "****1234"
   */
  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Create a masked version of sensitive data
   * e.g., "1234567890123456" -> "****3456"
   */
  maskData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }
    const masked = '*'.repeat(data.length - visibleChars);
    const visible = data.substring(data.length - visibleChars);
    return masked + visible;
  }

  /**
   * Generate a unique encryption key ID (for referencing keys)
   * This is NOT the key itself, just an identifier
   */
  generateKeyId(): string {
    return crypto.randomUUID();
  }

  /**
   * Encrypt file contents before S3 upload
   * Returns encrypted buffer
   */
  encryptFile(fileBuffer: Buffer, encryptionKey: string): Buffer {
    try {
      const key = Buffer.from(encryptionKey, 'base64');
      const iv = crypto.randomBytes(this.ivLength);
      
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      
      let encrypted = cipher.update(fileBuffer);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      
      const authTag = cipher.getAuthTag();
      
      // Combine iv + encrypted + authTag
      return Buffer.concat([iv, encrypted, authTag]);
    } catch (error) {
      this.logger.error('File encryption failed', error.stack);
      throw new Error('File encryption failed');
    }
  }

  /**
   * Decrypt file contents after S3 download
   * Returns decrypted buffer
   */
  decryptFile(encryptedBuffer: Buffer, encryptionKey: string): Buffer {
    try {
      const key = Buffer.from(encryptionKey, 'base64');
      
      // Extract iv, encrypted data, and authTag
      const iv = encryptedBuffer.subarray(0, this.ivLength);
      const authTag = encryptedBuffer.subarray(encryptedBuffer.length - this.tagLength);
      const encrypted = encryptedBuffer.subarray(this.ivLength, encryptedBuffer.length - this.tagLength);
      
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return decrypted;
    } catch (error) {
      this.logger.error('File decryption failed', error.stack);
      throw new UnauthorizedException('Invalid encryption key or corrupted file');
    }
  }

  /**
   * Verify that a user has access to decrypt data
   * This is a placeholder - implement actual authorization logic
   */
  verifyDecryptionAccess(userId: string, dataOwnerId: string, userRole: string): boolean {
    // Super Admin should NEVER have access
    if (userRole === 'SUPER_ADMIN') {
      this.logger.warn(`Super Admin attempted to access encrypted data for user ${dataOwnerId}`);
      return false;
    }

    // Only the data owner can decrypt
    return userId === dataOwnerId;
  }
}
