import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase3Accounting1702200000000 implements MigrationInterface {
  name = 'Phase3Accounting1702200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create accounts table (Chart of Accounts)
    await queryRunner.query(`
      CREATE TYPE "account_type_enum" AS ENUM ('asset', 'liability', 'equity', 'income', 'expense');
      
      CREATE TABLE "accounts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "code" varchar(50) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "type" "account_type_enum" NOT NULL,
        "parent_account_id" uuid NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "is_system" boolean NOT NULL DEFAULT false,
        "description" text NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_accounts_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_accounts_parent" FOREIGN KEY ("parent_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_accounts_tenant_id" ON "accounts"("tenant_id");
      CREATE INDEX "idx_accounts_type" ON "accounts"("type");
      CREATE INDEX "idx_accounts_code" ON "accounts"("code");
    `);

    // Enable RLS for accounts
    await queryRunner.query(`
      ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "accounts"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // Create journal_entries table
    await queryRunner.query(`
      CREATE TABLE "journal_entries" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "journal_number" varchar(50) NOT NULL UNIQUE,
        "date" date NOT NULL,
        "reference" varchar(255) NULL,
        "memo" text NULL,
        "created_by_user_id" uuid NOT NULL,
        "is_posted" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_journal_entries_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_journal_entries_user" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      );
      
      CREATE INDEX "idx_journal_entries_tenant_id" ON "journal_entries"("tenant_id");
      CREATE INDEX "idx_journal_entries_date" ON "journal_entries"("date");
      CREATE INDEX "idx_journal_entries_number" ON "journal_entries"("journal_number");
    `);

    // Enable RLS for journal_entries
    await queryRunner.query(`
      ALTER TABLE "journal_entries" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "journal_entries"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // Create journal_entry_lines table
    await queryRunner.query(`
      CREATE TABLE "journal_entry_lines" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "entry_id" uuid NOT NULL,
        "account_id" uuid NOT NULL,
        "debit" decimal(15,2) NOT NULL DEFAULT 0,
        "credit" decimal(15,2) NOT NULL DEFAULT 0,
        "description" varchar(500) NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "fk_journal_entry_lines_entry" FOREIGN KEY ("entry_id") REFERENCES "journal_entries"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_journal_entry_lines_account" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT
      );
      
      CREATE INDEX "idx_journal_entry_lines_entry_id" ON "journal_entry_lines"("entry_id");
      CREATE INDEX "idx_journal_entry_lines_account_id" ON "journal_entry_lines"("account_id");
    `);

    // Create invoices table
    await queryRunner.query(`
      CREATE TYPE "invoice_type_enum" AS ENUM ('customer', 'vendor');
      CREATE TYPE "invoice_status_enum" AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
      
      CREATE TABLE "invoices" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "invoice_number" varchar(50) NOT NULL UNIQUE,
        "type" "invoice_type_enum" NOT NULL,
        "company_id" uuid NOT NULL,
        "contact_id" uuid NULL,
        "currency" varchar(3) NOT NULL DEFAULT 'USD',
        "status" "invoice_status_enum" NOT NULL DEFAULT 'draft',
        "issue_date" date NOT NULL,
        "due_date" date NOT NULL,
        "subtotal" decimal(15,2) NOT NULL DEFAULT 0,
        "tax_total" decimal(15,2) NOT NULL DEFAULT 0,
        "discount_total" decimal(15,2) NOT NULL DEFAULT 0,
        "total" decimal(15,2) NOT NULL DEFAULT 0,
        "balance" decimal(15,2) NOT NULL DEFAULT 0,
        "notes" text NULL,
        "created_by_user_id" uuid NOT NULL,
        "journal_entry_id" uuid NULL,
        "sales_order_id" uuid NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_invoices_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_invoices_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_invoices_contact" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_invoices_user" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_invoices_journal_entry" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entries"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_invoices_sales_order" FOREIGN KEY ("sales_order_id") REFERENCES "sales_orders"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_invoices_tenant_id" ON "invoices"("tenant_id");
      CREATE INDEX "idx_invoices_company_id" ON "invoices"("company_id");
      CREATE INDEX "idx_invoices_status" ON "invoices"("status");
      CREATE INDEX "idx_invoices_type" ON "invoices"("type");
      CREATE INDEX "idx_invoices_number" ON "invoices"("invoice_number");
    `);

    // Enable RLS for invoices
    await queryRunner.query(`
      ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "invoices"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // Create invoice_lines table
    await queryRunner.query(`
      CREATE TABLE "invoice_lines" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "invoice_id" uuid NOT NULL,
        "product_id" uuid NULL,
        "description" varchar(500) NOT NULL,
        "qty" decimal(15,3) NOT NULL,
        "unit_price" decimal(15,2) NOT NULL,
        "tax_rate" decimal(5,2) NOT NULL DEFAULT 0,
        "discount" decimal(15,2) NOT NULL DEFAULT 0,
        "total" decimal(15,2) NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "fk_invoice_lines_invoice" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_invoice_lines_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_invoice_lines_invoice_id" ON "invoice_lines"("invoice_id");
      CREATE INDEX "idx_invoice_lines_product_id" ON "invoice_lines"("product_id");
    `);

    // Create payments table
    await queryRunner.query(`
      CREATE TYPE "payment_method_enum" AS ENUM ('card', 'bank', 'cash', 'check', 'other');
      
      CREATE TABLE "payments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "payment_number" varchar(50) NOT NULL UNIQUE,
        "invoice_id" uuid NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "date" date NOT NULL,
        "method" "payment_method_enum" NOT NULL,
        "gateway_ref" varchar(255) NULL,
        "notes" text NULL,
        "created_by_user_id" uuid NOT NULL,
        "journal_entry_id" uuid NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_payments_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_payments_invoice" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_payments_user" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_payments_journal_entry" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entries"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_payments_tenant_id" ON "payments"("tenant_id");
      CREATE INDEX "idx_payments_invoice_id" ON "payments"("invoice_id");
      CREATE INDEX "idx_payments_date" ON "payments"("date");
    `);

    // Enable RLS for payments
    await queryRunner.query(`
      ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "payments"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // Create bank_accounts table
    await queryRunner.query(`
      CREATE TABLE "bank_accounts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "account_number" varchar(100) NOT NULL,
        "currency" varchar(3) NOT NULL DEFAULT 'USD',
        "bank_name" varchar(255) NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_bank_accounts_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "idx_bank_accounts_tenant_id" ON "bank_accounts"("tenant_id");
    `);

    // Enable RLS for bank_accounts
    await queryRunner.query(`
      ALTER TABLE "bank_accounts" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "bank_accounts"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // Create bank_transactions table
    await queryRunner.query(`
      CREATE TYPE "bank_transaction_status_enum" AS ENUM ('unmatched', 'matched', 'reconciled');
      
      CREATE TABLE "bank_transactions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "bank_account_id" uuid NOT NULL,
        "date" date NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "description" varchar(500) NOT NULL,
        "reference" varchar(255) NULL,
        "status" "bank_transaction_status_enum" NOT NULL DEFAULT 'unmatched',
        "matched_invoice_id" uuid NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "fk_bank_transactions_account" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_bank_transactions_invoice" FOREIGN KEY ("matched_invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_bank_transactions_account_id" ON "bank_transactions"("bank_account_id");
      CREATE INDEX "idx_bank_transactions_date" ON "bank_transactions"("date");
      CREATE INDEX "idx_bank_transactions_status" ON "bank_transactions"("status");
    `);

    // Create tax_rules table
    await queryRunner.query(`
      CREATE TYPE "tax_type_enum" AS ENUM ('inclusive', 'exclusive');
      
      CREATE TABLE "tax_rules" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "code" varchar(50) NOT NULL UNIQUE,
        "rate" decimal(5,2) NOT NULL,
        "type" "tax_type_enum" NOT NULL DEFAULT 'exclusive',
        "region" varchar(100) NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "description" text NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_tax_rules_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "idx_tax_rules_tenant_id" ON "tax_rules"("tenant_id");
      CREATE INDEX "idx_tax_rules_code" ON "tax_rules"("code");
    `);

    // Enable RLS for tax_rules
    await queryRunner.query(`
      ALTER TABLE "tax_rules" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "tax_rules"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "tax_rules" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tax_type_enum";`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "bank_transactions" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "bank_transaction_status_enum";`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "bank_accounts" CASCADE;`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "payments" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_method_enum";`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "invoice_lines" CASCADE;`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "invoices" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "invoice_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "invoice_status_enum";`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "journal_entry_lines" CASCADE;`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "journal_entries" CASCADE;`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "accounts" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "account_type_enum";`);
  }
}
