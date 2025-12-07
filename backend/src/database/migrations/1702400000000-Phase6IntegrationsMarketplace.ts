import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase6IntegrationsMarketplace1702400000000 implements MigrationInterface {
  name = 'Phase6IntegrationsMarketplace1702400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create integrations table
    await queryRunner.query(`
      CREATE TABLE "integrations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "type" varchar NOT NULL,
        "name" varchar NOT NULL,
        "config" jsonb NOT NULL DEFAULT '{}',
        "status" varchar NOT NULL DEFAULT 'inactive',
        "last_tested_at" timestamp,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_integrations_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_integrations_tenant_id" ON "integrations" ("tenant_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_integrations_type" ON "integrations" ("type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_integrations_status" ON "integrations" ("status")
    `);

    // Create webhook_subscriptions table
    await queryRunner.query(`
      CREATE TABLE "webhook_subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "integration_id" uuid,
        "target_url" varchar NOT NULL,
        "events" jsonb NOT NULL DEFAULT '[]',
        "secret" varchar NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_webhook_subscriptions_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_webhook_subscriptions_integration" FOREIGN KEY ("integration_id") REFERENCES "integrations"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_webhook_subscriptions_tenant_id" ON "webhook_subscriptions" ("tenant_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_webhook_subscriptions_integration_id" ON "webhook_subscriptions" ("integration_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_webhook_subscriptions_is_active" ON "webhook_subscriptions" ("is_active")
    `);

    // Create plugins table
    await queryRunner.query(`
      CREATE TABLE "plugins" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "key" varchar NOT NULL UNIQUE,
        "version" varchar NOT NULL,
        "description" text,
        "config_schema" jsonb NOT NULL DEFAULT '{}',
        "is_enabled" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plugins_key" ON "plugins" ("key")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plugins_is_enabled" ON "plugins" ("is_enabled")
    `);

    // Create plugin_configs table
    await queryRunner.query(`
      CREATE TABLE "plugin_configs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "plugin_key" varchar NOT NULL,
        "tenant_id" uuid NOT NULL,
        "config" jsonb NOT NULL DEFAULT '{}',
        "is_enabled" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_plugin_configs_plugin" FOREIGN KEY ("plugin_key") REFERENCES "plugins"("key") ON DELETE CASCADE,
        CONSTRAINT "FK_plugin_configs_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_plugin_configs_plugin_tenant" UNIQUE ("plugin_key", "tenant_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plugin_configs_plugin_key" ON "plugin_configs" ("plugin_key")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plugin_configs_tenant_id" ON "plugin_configs" ("tenant_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plugin_configs_is_enabled" ON "plugin_configs" ("is_enabled")
    `);

    // Add payment gateway reference to payments table (if exists)
    await queryRunner.query(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
          ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "gateway" varchar;
          ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "gateway_ref" varchar;
          ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "gateway_response" jsonb;
          CREATE INDEX IF NOT EXISTS "IDX_payments_gateway" ON "payments" ("gateway");
          CREATE INDEX IF NOT EXISTS "IDX_payments_gateway_ref" ON "payments" ("gateway_ref");
        END IF;
      END $$;
    `);

    // Add partitioning documentation comments
    await queryRunner.query(`
      COMMENT ON TABLE "journal_entries" IS 'Partition by created_at monthly for scalability. Use pg_partman for automatic partition management.';
    `);

    await queryRunner.query(`
      COMMENT ON TABLE "audit_logs" IS 'Partition by created_at monthly for scalability. Use pg_partman for automatic partition management.';
    `);

    await queryRunner.query(`
      COMMENT ON TABLE "workflow_logs" IS 'Partition by run_at monthly for scalability. Use pg_partman for automatic partition management.';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove partitioning comments
    await queryRunner.query(`COMMENT ON TABLE "journal_entries" IS NULL`);
    await queryRunner.query(`COMMENT ON TABLE "audit_logs" IS NULL`);
    await queryRunner.query(`COMMENT ON TABLE "workflow_logs" IS NULL`);

    // Remove payment gateway columns
    await queryRunner.query(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
          DROP INDEX IF EXISTS "IDX_payments_gateway_ref";
          DROP INDEX IF EXISTS "IDX_payments_gateway";
          ALTER TABLE "payments" DROP COLUMN IF EXISTS "gateway_response";
          ALTER TABLE "payments" DROP COLUMN IF EXISTS "gateway_ref";
          ALTER TABLE "payments" DROP COLUMN IF EXISTS "gateway";
        END IF;
      END $$;
    `);

    // Drop plugin_configs table
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plugin_configs_is_enabled"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plugin_configs_tenant_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plugin_configs_plugin_key"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plugin_configs"`);

    // Drop plugins table
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plugins_is_enabled"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plugins_key"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plugins"`);

    // Drop webhook_subscriptions table
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_webhook_subscriptions_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_webhook_subscriptions_integration_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_webhook_subscriptions_tenant_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "webhook_subscriptions"`);

    // Drop integrations table
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_integrations_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_integrations_type"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_integrations_tenant_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "integrations"`);
  }
}
