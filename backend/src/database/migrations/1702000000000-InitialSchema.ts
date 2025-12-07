import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1702000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create tenants table
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "slug" varchar(100) UNIQUE NOT NULL,
        "plan" varchar(50) DEFAULT 'free',
        "config" jsonb,
        "isActive" boolean DEFAULT true,
        "logoUrl" varchar(500),
        "primaryColor" varchar(7) DEFAULT '#3B82F6',
        "locale" varchar(10) DEFAULT 'en',
        "timezone" varchar(50) DEFAULT 'UTC',
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "email" varchar(255) UNIQUE NOT NULL,
        "displayName" varchar(255) NOT NULL,
        "passwordHash" varchar(255) NOT NULL,
        "isActive" boolean DEFAULT true,
        "lastLogin" timestamp,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "name" varchar(100) NOT NULL,
        "description" text,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        UNIQUE("tenantId", "name")
      )
    `);

    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "code" varchar(100) UNIQUE NOT NULL,
        "description" text,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create user_roles junction table
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "roleId" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        PRIMARY KEY ("userId", "roleId")
      )
    `);

    // Create role_permissions junction table
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "roleId" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        "permissionId" uuid NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
        PRIMARY KEY ("roleId", "permissionId")
      )
    `);

    // Create settings table
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "scope" varchar(20) DEFAULT 'tenant',
        "key" varchar(255) NOT NULL,
        "value" jsonb NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        UNIQUE("tenantId", "scope", "key")
      )
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "actorUserId" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "action" varchar(50) NOT NULL,
        "objectType" varchar(100) NOT NULL,
        "objectId" uuid,
        "before" jsonb,
        "after" jsonb,
        "createdAt" timestamp DEFAULT now()
      )
    `);

    // Create files table
    await queryRunner.query(`
      CREATE TABLE "files" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "path" varchar(500) NOT NULL,
        "filename" varchar(255) NOT NULL,
        "size" bigint NOT NULL,
        "mimeType" varchar(100) NOT NULL,
        "createdByUserId" uuid NOT NULL REFERENCES "users"("id"),
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create notifications table
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "type" varchar(20) DEFAULT 'inapp',
        "channelDetails" jsonb,
        "payload" jsonb NOT NULL,
        "status" varchar(20) DEFAULT 'pending',
        "createdAt" timestamp DEFAULT now(),
        "sentAt" timestamp,
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "idx_users_tenantId" ON "users"("tenantId")`);
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users"("email")`);
    await queryRunner.query(`CREATE INDEX "idx_roles_tenantId" ON "roles"("tenantId")`);
    await queryRunner.query(`CREATE INDEX "idx_settings_tenantId" ON "settings"("tenantId")`);
    await queryRunner.query(`CREATE INDEX "idx_audit_logs_tenantId" ON "audit_logs"("tenantId")`);
    await queryRunner.query(`CREATE INDEX "idx_audit_logs_actorUserId" ON "audit_logs"("actorUserId")`);
    await queryRunner.query(`CREATE INDEX "idx_audit_logs_objectType" ON "audit_logs"("objectType")`);
    await queryRunner.query(`CREATE INDEX "idx_audit_logs_createdAt" ON "audit_logs"("createdAt")`);
    await queryRunner.query(`CREATE INDEX "idx_files_tenantId" ON "files"("tenantId")`);
    await queryRunner.query(`CREATE INDEX "idx_files_createdByUserId" ON "files"("createdByUserId")`);
    await queryRunner.query(`CREATE INDEX "idx_notifications_tenantId" ON "notifications"("tenantId")`);
    await queryRunner.query(`CREATE INDEX "idx_notifications_userId" ON "notifications"("userId")`);
    await queryRunner.query(`CREATE INDEX "idx_notifications_status" ON "notifications"("status")`);

    // Enable Row Level Security
    await queryRunner.query(`ALTER TABLE "users" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "files" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY`);

    // Create RLS policies
    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "users"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "roles"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "settings"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "audit_logs"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "files"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON "notifications"
      USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "files"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "settings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants"`);
  }
}
