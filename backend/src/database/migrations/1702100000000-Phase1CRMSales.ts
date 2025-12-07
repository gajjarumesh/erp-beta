import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase1CRMSales1702100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create companies table
    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "name" varchar(255) NOT NULL,
        "type" varchar(20) DEFAULT 'customer' CHECK ("type" IN ('customer', 'vendor', 'both')),
        "taxIds" jsonb,
        "billingAddress" text,
        "shippingAddress" text,
        "defaultCurrency" varchar(10) DEFAULT 'USD',
        "email" varchar(255),
        "phone" varchar(50),
        "website" varchar(255),
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_companies_tenantId" ON "companies" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_companies_name" ON "companies" ("name")`);

    // Create contacts table
    await queryRunner.query(`
      CREATE TABLE "contacts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "companyId" uuid REFERENCES "companies"("id") ON DELETE CASCADE,
        "firstName" varchar(100) NOT NULL,
        "lastName" varchar(100) NOT NULL,
        "email" varchar(255),
        "phone" varchar(50),
        "role" varchar(100),
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_contacts_tenantId" ON "contacts" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_contacts_companyId" ON "contacts" ("companyId")`);
    await queryRunner.query(`CREATE INDEX "IDX_contacts_email" ON "contacts" ("email")`);

    // Create pipelines table
    await queryRunner.query(`
      CREATE TABLE "pipelines" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "name" varchar(255) NOT NULL,
        "description" text,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_pipelines_tenantId" ON "pipelines" ("tenantId")`);

    // Create stages table
    await queryRunner.query(`
      CREATE TABLE "stages" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "pipelineId" uuid NOT NULL REFERENCES "pipelines"("id") ON DELETE CASCADE,
        "name" varchar(255) NOT NULL,
        "sortOrder" int DEFAULT 0,
        "isWon" boolean DEFAULT false,
        "isLost" boolean DEFAULT false,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_stages_tenantId" ON "stages" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_stages_pipelineId" ON "stages" ("pipelineId")`);

    // Create leads table
    await queryRunner.query(`
      CREATE TABLE "leads" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "companyId" uuid REFERENCES "companies"("id") ON DELETE SET NULL,
        "contactId" uuid REFERENCES "contacts"("id") ON DELETE SET NULL,
        "status" varchar(20) DEFAULT 'new' CHECK ("status" IN ('new', 'qualified', 'lost', 'won')),
        "source" varchar(50) DEFAULT 'other' CHECK ("source" IN ('website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'trade_show', 'other')),
        "score" int,
        "ownerUserId" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "tags" text,
        "notes" text,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_leads_tenantId" ON "leads" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_leads_companyId" ON "leads" ("companyId")`);
    await queryRunner.query(`CREATE INDEX "IDX_leads_contactId" ON "leads" ("contactId")`);
    await queryRunner.query(`CREATE INDEX "IDX_leads_status" ON "leads" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_leads_ownerUserId" ON "leads" ("ownerUserId")`);

    // Create opportunities table
    await queryRunner.query(`
      CREATE TABLE "opportunities" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "companyId" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
        "contactId" uuid REFERENCES "contacts"("id") ON DELETE SET NULL,
        "pipelineId" uuid NOT NULL REFERENCES "pipelines"("id") ON DELETE CASCADE,
        "stageId" uuid NOT NULL REFERENCES "stages"("id") ON DELETE CASCADE,
        "value" decimal(10,2),
        "currency" varchar(10) DEFAULT 'USD',
        "probability" int,
        "expectedCloseDate" date,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_opportunities_tenantId" ON "opportunities" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_opportunities_companyId" ON "opportunities" ("companyId")`);
    await queryRunner.query(`CREATE INDEX "IDX_opportunities_pipelineId" ON "opportunities" ("pipelineId")`);
    await queryRunner.query(`CREATE INDEX "IDX_opportunities_stageId" ON "opportunities" ("stageId")`);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "sku" varchar(100) UNIQUE NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "uom" varchar(50) DEFAULT 'unit',
        "basePrice" decimal(10,2) NOT NULL,
        "costPrice" decimal(10,2) DEFAULT 0,
        "taxClass" varchar(50),
        "attributes" jsonb,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_products_tenantId" ON "products" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_products_name" ON "products" ("name")`);

    // Create product_variants table
    await queryRunner.query(`
      CREATE TABLE "product_variants" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "productId" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "variantAttributes" jsonb,
        "sku" varchar(100) UNIQUE NOT NULL,
        "priceOverride" decimal(10,2),
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_product_variants_tenantId" ON "product_variants" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_product_variants_productId" ON "product_variants" ("productId")`);

    // Create price_rules table
    await queryRunner.query(`
      CREATE TABLE "price_rules" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "name" varchar(255) NOT NULL,
        "active" boolean DEFAULT true,
        "priority" int DEFAULT 0,
        "conditions" jsonb,
        "calculation" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_price_rules_tenantId" ON "price_rules" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_price_rules_active" ON "price_rules" ("active")`);

    // Create sales_quotes table
    await queryRunner.query(`
      CREATE TABLE "sales_quotes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "companyId" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
        "contactId" uuid REFERENCES "contacts"("id") ON DELETE SET NULL,
        "quoteNumber" varchar(50) UNIQUE NOT NULL,
        "status" varchar(20) DEFAULT 'draft' CHECK ("status" IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
        "validUntil" date,
        "currency" varchar(10) DEFAULT 'USD',
        "subtotal" decimal(10,2) DEFAULT 0,
        "taxTotal" decimal(10,2) DEFAULT 0,
        "discountTotal" decimal(10,2) DEFAULT 0,
        "total" decimal(10,2) DEFAULT 0,
        "notes" text,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sales_quotes_tenantId" ON "sales_quotes" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sales_quotes_companyId" ON "sales_quotes" ("companyId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sales_quotes_status" ON "sales_quotes" ("status")`);

    // Create sales_quote_lines table
    await queryRunner.query(`
      CREATE TABLE "sales_quote_lines" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "quoteId" uuid NOT NULL REFERENCES "sales_quotes"("id") ON DELETE CASCADE,
        "productId" uuid REFERENCES "products"("id") ON DELETE SET NULL,
        "description" text,
        "qty" int NOT NULL,
        "unitPrice" decimal(10,2) NOT NULL,
        "discount" decimal(10,2) DEFAULT 0,
        "taxRate" decimal(5,2) DEFAULT 0,
        "total" decimal(10,2) NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sales_quote_lines_tenantId" ON "sales_quote_lines" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sales_quote_lines_quoteId" ON "sales_quote_lines" ("quoteId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sales_quote_lines_productId" ON "sales_quote_lines" ("productId")`);

    // Create sales_orders table
    await queryRunner.query(`
      CREATE TABLE "sales_orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "companyId" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
        "contactId" uuid REFERENCES "contacts"("id") ON DELETE SET NULL,
        "orderNumber" varchar(50) UNIQUE NOT NULL,
        "status" varchar(20) DEFAULT 'draft' CHECK ("status" IN ('draft', 'confirmed', 'delivered', 'invoiced', 'cancelled')),
        "currency" varchar(10) DEFAULT 'USD',
        "subtotal" decimal(10,2) DEFAULT 0,
        "taxTotal" decimal(10,2) DEFAULT 0,
        "discountTotal" decimal(10,2) DEFAULT 0,
        "total" decimal(10,2) DEFAULT 0,
        "notes" text,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sales_orders_tenantId" ON "sales_orders" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sales_orders_companyId" ON "sales_orders" ("companyId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sales_orders_status" ON "sales_orders" ("status")`);

    // Create sales_order_lines table
    await queryRunner.query(`
      CREATE TABLE "sales_order_lines" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "orderId" uuid NOT NULL REFERENCES "sales_orders"("id") ON DELETE CASCADE,
        "productId" uuid REFERENCES "products"("id") ON DELETE SET NULL,
        "description" text,
        "qty" int NOT NULL,
        "unitPrice" decimal(10,2) NOT NULL,
        "discount" decimal(10,2) DEFAULT 0,
        "taxRate" decimal(5,2) DEFAULT 0,
        "total" decimal(10,2) NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        "deletedAt" timestamp
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sales_order_lines_tenantId" ON "sales_order_lines" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sales_order_lines_orderId" ON "sales_order_lines" ("orderId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sales_order_lines_productId" ON "sales_order_lines" ("productId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (respecting foreign keys)
    await queryRunner.query(`DROP TABLE IF EXISTS "sales_order_lines"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sales_orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sales_quote_lines"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sales_quotes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "price_rules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_variants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "opportunities"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "leads"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pipelines"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "contacts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "companies"`);
  }
}
