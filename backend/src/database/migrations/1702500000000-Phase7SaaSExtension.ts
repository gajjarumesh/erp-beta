import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase7SaaSExtension1702500000000 implements MigrationInterface {
  name = 'Phase7SaaSExtension1702500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =====================================================
    // PHASE 7: SaaS, Custom Packages, Billing & Helpdesk Extension
    // =====================================================

    // 1. MODULES CATALOG
    await queryRunner.query(`
      CREATE TABLE "modules_catalog" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "slug" varchar(100) UNIQUE NOT NULL,
        "name" varchar(200) NOT NULL,
        "description" text,
        "yearlyPrice" decimal(10,2) NOT NULL,
        "icon" varchar(100),
        "color" varchar(50),
        "isActive" boolean DEFAULT true,
        "sortOrder" int DEFAULT 0,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_modules_catalog_slug" ON "modules_catalog" ("slug")
    `);

    // 2. SUB-MODULES CATALOG
    await queryRunner.query(`
      CREATE TABLE "sub_modules_catalog" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "moduleId" uuid NOT NULL,
        "slug" varchar(100) NOT NULL,
        "name" varchar(200) NOT NULL,
        "description" text,
        "yearlyPrice" decimal(10,2) NOT NULL,
        "isActive" boolean DEFAULT true,
        "sortOrder" int DEFAULT 0,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("moduleId") REFERENCES "modules_catalog"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_sub_modules_catalog_moduleId" ON "sub_modules_catalog" ("moduleId")
    `);

    // 3. LIMIT TYPES CATALOG
    await queryRunner.query(`
      CREATE TYPE "limit_type_enum" AS ENUM ('users', 'storage_gb', 'transactions', 'records', 'api_calls')
    `);

    await queryRunner.query(`
      CREATE TABLE "limit_types_catalog" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "slug" varchar(100) UNIQUE NOT NULL,
        "type" "limit_type_enum" NOT NULL,
        "name" varchar(200) NOT NULL,
        "description" text,
        "unit" varchar(50) NOT NULL,
        "defaultLimit" int NOT NULL,
        "pricePerUnit" decimal(10,2) NOT NULL,
        "incrementStep" int DEFAULT 1,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // 4. CUSTOM PACKAGES
    await queryRunner.query(`
      CREATE TYPE "package_status_enum" AS ENUM ('draft', 'active', 'suspended', 'cancelled')
    `);

    await queryRunner.query(`
      CREATE TABLE "custom_packages" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "name" varchar(200) NOT NULL,
        "description" text,
        "totalYearlyPrice" decimal(10,2) NOT NULL,
        "status" "package_status_enum" DEFAULT 'draft',
        "activatedAt" timestamp,
        "suspendedAt" timestamp,
        "cancelledAt" timestamp,
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp,
        FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_custom_packages_tenantId" ON "custom_packages" ("tenantId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_custom_packages_status" ON "custom_packages" ("status")
    `);

    // 5. CUSTOM PACKAGE MODULES (Junction)
    await queryRunner.query(`
      CREATE TABLE "custom_package_modules" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "packageId" uuid NOT NULL,
        "moduleId" uuid NOT NULL,
        "priceAtPurchase" decimal(10,2) NOT NULL,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        FOREIGN KEY ("packageId") REFERENCES "custom_packages"("id") ON DELETE CASCADE,
        FOREIGN KEY ("moduleId") REFERENCES "modules_catalog"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_custom_package_modules_packageId" ON "custom_package_modules" ("packageId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_custom_package_modules_moduleId" ON "custom_package_modules" ("moduleId")
    `);

    // 6. CUSTOM PACKAGE SUB-MODULES (Junction)
    await queryRunner.query(`
      CREATE TABLE "custom_package_sub_modules" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "packageId" uuid NOT NULL,
        "subModuleId" uuid NOT NULL,
        "priceAtPurchase" decimal(10,2) NOT NULL,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        FOREIGN KEY ("packageId") REFERENCES "custom_packages"("id") ON DELETE CASCADE,
        FOREIGN KEY ("subModuleId") REFERENCES "sub_modules_catalog"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_custom_package_sub_modules_packageId" ON "custom_package_sub_modules" ("packageId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_custom_package_sub_modules_subModuleId" ON "custom_package_sub_modules" ("subModuleId")
    `);

    // 7. CUSTOM PACKAGE LIMITS
    await queryRunner.query(`
      CREATE TABLE "custom_package_limits" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "packageId" uuid NOT NULL,
        "limitTypeId" uuid NOT NULL,
        "limitValue" int NOT NULL,
        "priceAtPurchase" decimal(10,2) NOT NULL,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("packageId") REFERENCES "custom_packages"("id") ON DELETE CASCADE,
        FOREIGN KEY ("limitTypeId") REFERENCES "limit_types_catalog"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_custom_package_limits_packageId" ON "custom_package_limits" ("packageId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_custom_package_limits_limitTypeId" ON "custom_package_limits" ("limitTypeId")
    `);

    // 8. PHASE 7 SUBSCRIPTIONS (Yearly Razorpay)
    await queryRunner.query(`
      CREATE TYPE "phase7_subscription_status_enum" AS ENUM ('trial', 'active', 'grace_period', 'suspended', 'cancelled', 'expired')
    `);

    await queryRunner.query(`
      CREATE TYPE "payment_cycle_enum" AS ENUM ('yearly')
    `);

    await queryRunner.query(`
      CREATE TABLE "phase7_subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "customPackageId" uuid NOT NULL,
        "status" "phase7_subscription_status_enum" DEFAULT 'trial',
        "billingCycle" "payment_cycle_enum" DEFAULT 'yearly',
        "yearlyAmount" decimal(10,2) NOT NULL,
        "currency" varchar(10) DEFAULT 'INR',
        "startDate" timestamp NOT NULL,
        "renewalDate" timestamp NOT NULL,
        "trialEndsAt" timestamp,
        "cancelledAt" timestamp,
        "suspendedAt" timestamp,
        "gracePeriodDays" int DEFAULT 7,
        "autoRenewalEnabled" boolean DEFAULT false,
        "razorpaySubscriptionId" varchar(255),
        "razorpayCustomerId" varchar(255),
        "razorpayData" jsonb,
        "lastRenewalAt" timestamp,
        "lastReminderSentAt" timestamp,
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp,
        FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        FOREIGN KEY ("customPackageId") REFERENCES "custom_packages"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_phase7_subscriptions_tenantId" ON "phase7_subscriptions" ("tenantId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_phase7_subscriptions_customPackageId" ON "phase7_subscriptions" ("customPackageId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_phase7_subscriptions_status" ON "phase7_subscriptions" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_phase7_subscriptions_renewalDate" ON "phase7_subscriptions" ("renewalDate")
    `);

    // 9. SECURE IDENTITY DATA (Zero-Access Encryption)
    await queryRunner.query(`
      CREATE TYPE "identity_data_type_enum" AS ENUM ('gst', 'pan', 'aadhaar', 'tax_id', 'ssn', 'other')
    `);

    await queryRunner.query(`
      CREATE TABLE "secure_identity_data" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "userId" uuid,
        "dataType" "identity_data_type_enum" NOT NULL,
        "encryptedData" text NOT NULL,
        "encryptionKeyId" text NOT NULL,
        "verificationStatus" varchar(100),
        "verificationReferenceId" varchar(255),
        "verifiedAt" timestamp,
        "maskedValue" varchar(100),
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp,
        FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_identity_data_tenantId" ON "secure_identity_data" ("tenantId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_identity_data_userId" ON "secure_identity_data" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_identity_data_dataType" ON "secure_identity_data" ("dataType")
    `);

    // 10. SECURE DOCUMENTS (Encrypted S3 Files)
    await queryRunner.query(`
      CREATE TYPE "document_type_enum" AS ENUM ('registration_certificate', 'tax_document', 'legal_agreement', 'identity_proof', 'address_proof', 'other')
    `);

    await queryRunner.query(`
      CREATE TABLE "secure_documents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "userId" uuid,
        "documentType" "document_type_enum" NOT NULL,
        "documentName" varchar(500) NOT NULL,
        "encryptedS3Key" text NOT NULL,
        "encryptedContent" text NOT NULL,
        "encryptionKeyId" text NOT NULL,
        "mimeType" varchar(100) NOT NULL,
        "sizeBytes" bigint NOT NULL,
        "checksum" varchar(100),
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp,
        FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_documents_tenantId" ON "secure_documents" ("tenantId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_documents_userId" ON "secure_documents" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_documents_documentType" ON "secure_documents" ("documentType")
    `);

    // 11. SECURE PAYMENT TOKENS (Encrypted Razorpay/Stripe Tokens)
    await queryRunner.query(`
      CREATE TYPE "payment_gateway_enum" AS ENUM ('razorpay', 'stripe', 'other')
    `);

    await queryRunner.query(`
      CREATE TABLE "secure_payment_tokens" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "userId" uuid,
        "gateway" "payment_gateway_enum" NOT NULL,
        "encryptedToken" text NOT NULL,
        "encryptionKeyId" text NOT NULL,
        "maskedCardNumber" varchar(100),
        "cardType" varchar(50),
        "expiryMonth" varchar(10),
        "expiryYear" varchar(10),
        "isDefault" boolean DEFAULT false,
        "autoDebitEnabled" boolean DEFAULT false,
        "lastUsedAt" timestamp,
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp,
        FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_payment_tokens_tenantId" ON "secure_payment_tokens" ("tenantId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_payment_tokens_userId" ON "secure_payment_tokens" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_secure_payment_tokens_gateway" ON "secure_payment_tokens" ("gateway")
    `);

    // 12. INQUIRIES (Contact Us Form)
    await queryRunner.query(`
      CREATE TYPE "inquiry_status_enum" AS ENUM ('new', 'in_progress', 'responded', 'closed')
    `);

    await queryRunner.query(`
      CREATE TYPE "inquiry_type_enum" AS ENUM ('general', 'sales', 'support', 'partnership', 'other')
    `);

    await queryRunner.query(`
      CREATE TABLE "inquiries" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(200) NOT NULL,
        "email" varchar(255) NOT NULL,
        "phone" varchar(50),
        "company" varchar(200),
        "inquiryType" "inquiry_type_enum" DEFAULT 'general',
        "subject" varchar(500) NOT NULL,
        "message" text NOT NULL,
        "status" "inquiry_status_enum" DEFAULT 'new',
        "ipAddress" varchar(100),
        "userAgent" text,
        "metadata" jsonb,
        "respondedAt" timestamp,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_inquiries_email" ON "inquiries" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_inquiries_status" ON "inquiries" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_inquiries_createdAt" ON "inquiries" ("createdAt")
    `);

    // 13. EXTEND TICKETS TABLE for GitHub Integration
    await queryRunner.query(`
      ALTER TABLE "tickets"
      ADD COLUMN "githubIssueId" varchar(100),
      ADD COLUMN "githubIssueUrl" varchar(500),
      ADD COLUMN "customerCanChangePriority" boolean DEFAULT false
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_tickets_githubIssueId" ON "tickets" ("githubIssueId")
    `);

    // 14. ROW-LEVEL SECURITY (RLS) for Phase 7 tables
    await queryRunner.query(`
      ALTER TABLE "custom_packages" ENABLE ROW LEVEL SECURITY
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "custom_packages"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      ALTER TABLE "phase7_subscriptions" ENABLE ROW LEVEL SECURITY
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "phase7_subscriptions"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      ALTER TABLE "secure_identity_data" ENABLE ROW LEVEL SECURITY
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "secure_identity_data"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      ALTER TABLE "secure_documents" ENABLE ROW LEVEL SECURITY
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "secure_documents"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      ALTER TABLE "secure_payment_tokens" ENABLE ROW LEVEL SECURITY
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "secure_payment_tokens"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    console.log('✅ Phase 7 migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "inquiries" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "inquiry_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "inquiry_type_enum"`);

    await queryRunner.query(`
      ALTER TABLE "tickets"
      DROP COLUMN IF EXISTS "githubIssueId",
      DROP COLUMN IF EXISTS "githubIssueUrl",
      DROP COLUMN IF EXISTS "customerCanChangePriority"
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "secure_payment_tokens" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_gateway_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "secure_documents" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "document_type_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "secure_identity_data" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "identity_data_type_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "phase7_subscriptions" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "phase7_subscription_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_cycle_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "custom_package_limits" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "custom_package_sub_modules" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "custom_package_modules" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "custom_packages" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "package_status_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "limit_types_catalog" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "limit_type_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "sub_modules_catalog" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "modules_catalog" CASCADE`);

    console.log('✅ Phase 7 migration reverted successfully');
  }
}
