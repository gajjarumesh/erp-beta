import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase4HRProjectsHelpdesk1702300000000 implements MigrationInterface {
  name = 'Phase4HRProjectsHelpdesk1702300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ===========================
    // HR MODULE - EMPLOYEES
    // ===========================
    
    // Create employees table
    await queryRunner.query(`
      CREATE TYPE "employee_status_enum" AS ENUM ('active', 'inactive', 'terminated');
      
      CREATE TABLE "employees" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "employee_code" varchar(50) NOT NULL UNIQUE,
        "department" varchar(255) NULL,
        "designation" varchar(255) NULL,
        "joining_date" date NOT NULL,
        "salary" jsonb NULL,
        "status" "employee_status_enum" NOT NULL DEFAULT 'active',
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_employees_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_employees_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      );
      
      CREATE INDEX "idx_employees_tenant_id" ON "employees"("tenant_id");
      CREATE INDEX "idx_employees_employee_code" ON "employees"("employee_code");
      CREATE INDEX "idx_employees_user_id" ON "employees"("user_id");
    `);

    // Enable RLS for employees
    await queryRunner.query(`
      ALTER TABLE "employees" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "employees"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // HR MODULE - ATTENDANCE
    // ===========================
    
    // Create attendance_logs table
    await queryRunner.query(`
      CREATE TYPE "attendance_source_enum" AS ENUM ('web', 'mobile', 'device');
      
      CREATE TABLE "attendance_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "employee_id" uuid NOT NULL,
        "clock_in" timestamp NOT NULL,
        "clock_out" timestamp NULL,
        "source" "attendance_source_enum" NOT NULL DEFAULT 'web',
        "notes" text NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_attendance_logs_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_attendance_logs_employee" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "idx_attendance_logs_tenant_id" ON "attendance_logs"("tenant_id");
      CREATE INDEX "idx_attendance_logs_employee_id" ON "attendance_logs"("employee_id");
      CREATE INDEX "idx_attendance_logs_clock_in" ON "attendance_logs"("clock_in");
    `);

    // Enable RLS for attendance_logs
    await queryRunner.query(`
      ALTER TABLE "attendance_logs" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "attendance_logs"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // HR MODULE - LEAVE REQUESTS
    // ===========================
    
    // Create leave_requests table
    await queryRunner.query(`
      CREATE TYPE "leave_type_enum" AS ENUM ('annual', 'sick', 'maternity', 'paternity', 'unpaid', 'other');
      CREATE TYPE "leave_status_enum" AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
      
      CREATE TABLE "leave_requests" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "employee_id" uuid NOT NULL,
        "type" "leave_type_enum" NOT NULL DEFAULT 'annual',
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "reason" text NULL,
        "status" "leave_status_enum" NOT NULL DEFAULT 'pending',
        "approver_id" uuid NULL,
        "approved_at" timestamp NULL,
        "approver_notes" text NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_leave_requests_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_leave_requests_employee" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_leave_requests_approver" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_leave_requests_tenant_id" ON "leave_requests"("tenant_id");
      CREATE INDEX "idx_leave_requests_employee_id" ON "leave_requests"("employee_id");
      CREATE INDEX "idx_leave_requests_status" ON "leave_requests"("status");
    `);

    // Enable RLS for leave_requests
    await queryRunner.query(`
      ALTER TABLE "leave_requests" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "leave_requests"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // HR MODULE - EXPENSE CLAIMS
    // ===========================
    
    // Create expense_claims table
    await queryRunner.query(`
      CREATE TYPE "expense_status_enum" AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'paid');
      
      CREATE TABLE "expense_claims" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "employee_id" uuid NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "currency" varchar(3) NOT NULL DEFAULT 'USD',
        "category" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "expense_date" date NOT NULL,
        "status" "expense_status_enum" NOT NULL DEFAULT 'draft',
        "approved_by" uuid NULL,
        "approved_at" timestamp NULL,
        "paid_at" timestamp NULL,
        "attachments" jsonb NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_expense_claims_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_expense_claims_employee" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_expense_claims_approver" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_expense_claims_tenant_id" ON "expense_claims"("tenant_id");
      CREATE INDEX "idx_expense_claims_employee_id" ON "expense_claims"("employee_id");
      CREATE INDEX "idx_expense_claims_status" ON "expense_claims"("status");
    `);

    // Enable RLS for expense_claims
    await queryRunner.query(`
      ALTER TABLE "expense_claims" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "expense_claims"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // PAYROLL MODULE - CONFIGS
    // ===========================
    
    // Create payroll_configs table
    await queryRunner.query(`
      CREATE TYPE "payroll_cycle_enum" AS ENUM ('weekly', 'biweekly', 'monthly', 'yearly');
      
      CREATE TABLE "payroll_configs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "employee_id" uuid NOT NULL,
        "base_salary" decimal(15,2) NOT NULL,
        "allowances" jsonb NULL,
        "deductions" jsonb NULL,
        "cycle" "payroll_cycle_enum" NOT NULL DEFAULT 'monthly',
        "currency" varchar(3) NOT NULL DEFAULT 'USD',
        "is_active" boolean NOT NULL DEFAULT true,
        "effective_from" date NULL,
        "effective_to" date NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_payroll_configs_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_payroll_configs_employee" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "idx_payroll_configs_tenant_id" ON "payroll_configs"("tenant_id");
      CREATE INDEX "idx_payroll_configs_employee_id" ON "payroll_configs"("employee_id");
    `);

    // Enable RLS for payroll_configs
    await queryRunner.query(`
      ALTER TABLE "payroll_configs" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "payroll_configs"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // PAYROLL MODULE - PAYSLIPS
    // ===========================
    
    // Create payslips table
    await queryRunner.query(`
      CREATE TYPE "payslip_status_enum" AS ENUM ('draft', 'processed', 'paid');
      
      CREATE TABLE "payslips" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "employee_id" uuid NOT NULL,
        "period_start" date NOT NULL,
        "period_end" date NOT NULL,
        "gross" decimal(15,2) NOT NULL,
        "net" decimal(15,2) NOT NULL,
        "breakdown" jsonb NOT NULL,
        "status" "payslip_status_enum" NOT NULL DEFAULT 'draft',
        "currency" varchar(3) NOT NULL DEFAULT 'USD',
        "processed_by" uuid NULL,
        "processed_at" timestamp NULL,
        "paid_at" timestamp NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_payslips_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_payslips_employee" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_payslips_processor" FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_payslips_tenant_id" ON "payslips"("tenant_id");
      CREATE INDEX "idx_payslips_employee_id" ON "payslips"("employee_id");
      CREATE INDEX "idx_payslips_period" ON "payslips"("period_start", "period_end");
    `);

    // Enable RLS for payslips
    await queryRunner.query(`
      ALTER TABLE "payslips" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "payslips"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // PROJECTS MODULE - PROJECTS
    // ===========================
    
    // Create projects table
    await queryRunner.query(`
      CREATE TYPE "project_status_enum" AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');
      
      CREATE TABLE "projects" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text NULL,
        "client_company_id" uuid NULL,
        "start_date" date NULL,
        "end_date" date NULL,
        "budget" decimal(15,2) NULL,
        "currency" varchar(3) NOT NULL DEFAULT 'USD',
        "status" "project_status_enum" NOT NULL DEFAULT 'planning',
        "metadata" jsonb NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_projects_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_projects_company" FOREIGN KEY ("client_company_id") REFERENCES "companies"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_projects_tenant_id" ON "projects"("tenant_id");
      CREATE INDEX "idx_projects_status" ON "projects"("status");
    `);

    // Enable RLS for projects
    await queryRunner.query(`
      ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "projects"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // PROJECTS MODULE - TASKS
    // ===========================
    
    // Create tasks table
    await queryRunner.query(`
      CREATE TYPE "task_status_enum" AS ENUM ('todo', 'in_progress', 'review', 'done', 'blocked');
      CREATE TYPE "task_priority_enum" AS ENUM ('low', 'medium', 'high', 'urgent');
      
      CREATE TABLE "tasks" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "project_id" uuid NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text NULL,
        "assignee_user_id" uuid NULL,
        "status" "task_status_enum" NOT NULL DEFAULT 'todo',
        "priority" "task_priority_enum" NOT NULL DEFAULT 'medium',
        "estimate_hours" decimal(10,2) NULL,
        "due_date" date NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_tasks_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_tasks_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_tasks_assignee" FOREIGN KEY ("assignee_user_id") REFERENCES "users"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_tasks_tenant_id" ON "tasks"("tenant_id");
      CREATE INDEX "idx_tasks_project_id" ON "tasks"("project_id");
      CREATE INDEX "idx_tasks_assignee_user_id" ON "tasks"("assignee_user_id");
      CREATE INDEX "idx_tasks_status" ON "tasks"("status");
    `);

    // Enable RLS for tasks
    await queryRunner.query(`
      ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "tasks"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // PROJECTS MODULE - TASK COMMENTS
    // ===========================
    
    // Create task_comments table
    await queryRunner.query(`
      CREATE TABLE "task_comments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "task_id" uuid NOT NULL,
        "author_user_id" uuid NOT NULL,
        "content" text NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_task_comments_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_task_comments_task" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_task_comments_author" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "idx_task_comments_tenant_id" ON "task_comments"("tenant_id");
      CREATE INDEX "idx_task_comments_task_id" ON "task_comments"("task_id");
    `);

    // Enable RLS for task_comments
    await queryRunner.query(`
      ALTER TABLE "task_comments" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "task_comments"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // PROJECTS MODULE - TIMESHEETS
    // ===========================
    
    // Create timesheets table
    await queryRunner.query(`
      CREATE TABLE "timesheets" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "employee_id" uuid NOT NULL,
        "project_id" uuid NOT NULL,
        "task_id" uuid NULL,
        "date" date NOT NULL,
        "hours" decimal(10,2) NOT NULL,
        "notes" text NULL,
        "billable" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_timesheets_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_timesheets_employee" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_timesheets_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_timesheets_task" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_timesheets_tenant_id" ON "timesheets"("tenant_id");
      CREATE INDEX "idx_timesheets_employee_id" ON "timesheets"("employee_id");
      CREATE INDEX "idx_timesheets_project_id" ON "timesheets"("project_id");
      CREATE INDEX "idx_timesheets_date" ON "timesheets"("date");
    `);

    // Enable RLS for timesheets
    await queryRunner.query(`
      ALTER TABLE "timesheets" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "timesheets"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // HELPDESK MODULE - SLA RULES
    // ===========================
    
    // Create sla_rules table
    await queryRunner.query(`
      CREATE TABLE "sla_rules" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text NULL,
        "target_response_minutes" integer NOT NULL,
        "target_resolution_minutes" integer NOT NULL,
        "applicable_priorities" jsonb NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_sla_rules_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "idx_sla_rules_tenant_id" ON "sla_rules"("tenant_id");
    `);

    // Enable RLS for sla_rules
    await queryRunner.query(`
      ALTER TABLE "sla_rules" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "sla_rules"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // HELPDESK MODULE - TICKETS
    // ===========================
    
    // Create tickets table
    await queryRunner.query(`
      CREATE TYPE "ticket_priority_enum" AS ENUM ('low', 'medium', 'high', 'urgent');
      CREATE TYPE "ticket_status_enum" AS ENUM ('new', 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed');
      
      CREATE TABLE "tickets" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "ticket_number" varchar(50) NOT NULL UNIQUE,
        "company_id" uuid NULL,
        "contact_id" uuid NULL,
        "subject" varchar(500) NOT NULL,
        "description" text NOT NULL,
        "priority" "ticket_priority_enum" NOT NULL DEFAULT 'medium',
        "status" "ticket_status_enum" NOT NULL DEFAULT 'new',
        "assignee_user_id" uuid NULL,
        "sla_rule_id" uuid NULL,
        "first_response_at" timestamp NULL,
        "resolved_at" timestamp NULL,
        "closed_at" timestamp NULL,
        "sla_response_deadline" timestamp NULL,
        "sla_resolution_deadline" timestamp NULL,
        "sla_response_breached" boolean NOT NULL DEFAULT false,
        "sla_resolution_breached" boolean NOT NULL DEFAULT false,
        "tags" jsonb NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_tickets_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_tickets_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_tickets_contact" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_tickets_assignee" FOREIGN KEY ("assignee_user_id") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_tickets_sla_rule" FOREIGN KEY ("sla_rule_id") REFERENCES "sla_rules"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "idx_tickets_tenant_id" ON "tickets"("tenant_id");
      CREATE INDEX "idx_tickets_ticket_number" ON "tickets"("ticket_number");
      CREATE INDEX "idx_tickets_company_id" ON "tickets"("company_id");
      CREATE INDEX "idx_tickets_status" ON "tickets"("status");
      CREATE INDEX "idx_tickets_priority" ON "tickets"("priority");
      CREATE INDEX "idx_tickets_assignee_user_id" ON "tickets"("assignee_user_id");
    `);

    // Enable RLS for tickets
    await queryRunner.query(`
      ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "tickets"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);

    // ===========================
    // HELPDESK MODULE - TICKET COMMENTS
    // ===========================
    
    // Create ticket_comments table
    await queryRunner.query(`
      CREATE TABLE "ticket_comments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "ticket_id" uuid NOT NULL,
        "author_user_id" uuid NOT NULL,
        "message" text NOT NULL,
        "is_internal" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp NULL,
        CONSTRAINT "fk_ticket_comments_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_ticket_comments_ticket" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_ticket_comments_author" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "idx_ticket_comments_tenant_id" ON "ticket_comments"("tenant_id");
      CREATE INDEX "idx_ticket_comments_ticket_id" ON "ticket_comments"("ticket_id");
    `);

    // Enable RLS for ticket_comments
    await queryRunner.query(`
      ALTER TABLE "ticket_comments" ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY tenant_isolation_policy ON "ticket_comments"
      USING ("tenant_id" = current_setting('app.current_tenant', true)::uuid);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "ticket_comments" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tickets" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sla_rules" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "timesheets" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_comments" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payslips" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payroll_configs" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expense_claims" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "leave_requests" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "attendance_logs" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employees" CASCADE;`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "ticket_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "ticket_priority_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "task_priority_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "task_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "project_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payslip_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payroll_cycle_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "expense_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "leave_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "leave_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "attendance_source_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "employee_status_enum";`);
  }
}
