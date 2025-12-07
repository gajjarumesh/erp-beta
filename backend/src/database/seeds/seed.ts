import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import dataSource from '../data-source';

async function seed() {
  await dataSource.initialize();

  console.log('🌱 Starting database seeding...');

  try {
    // Seed base permissions
    console.log('Creating base permissions...');
    const permissions = [
      // Tenant permissions
      { code: 'core:tenants:read', description: 'View tenant information' },
      { code: 'core:tenants:create', description: 'Create new tenants' },
      { code: 'core:tenants:update', description: 'Update tenant settings' },
      { code: 'core:tenants:delete', description: 'Delete tenants' },

      // User permissions
      { code: 'core:users:read', description: 'View users' },
      { code: 'core:users:create', description: 'Create new users' },
      { code: 'core:users:update', description: 'Update users' },
      { code: 'core:users:delete', description: 'Delete users' },

      // Role permissions
      { code: 'core:roles:read', description: 'View roles' },
      { code: 'core:roles:create', description: 'Create new roles' },
      { code: 'core:roles:update', description: 'Update roles' },
      { code: 'core:roles:delete', description: 'Delete roles' },

      // Settings permissions
      { code: 'core:settings:read', description: 'View settings' },
      { code: 'core:settings:update', description: 'Update settings' },

      // Audit permissions
      { code: 'core:audit:read', description: 'View audit logs' },

      // File permissions
      { code: 'core:files:read', description: 'View files' },
      { code: 'core:files:upload', description: 'Upload files' },
      { code: 'core:files:delete', description: 'Delete files' },

      // Notification permissions
      { code: 'core:notifications:read', description: 'View notifications' },
      { code: 'core:notifications:create', description: 'Create notifications' },
      { code: 'core:notifications:update', description: 'Update notifications' },

      // CRM permissions
      { code: 'crm:company:read', description: 'View companies' },
      { code: 'crm:company:create', description: 'Create companies' },
      { code: 'crm:company:update', description: 'Update companies' },
      { code: 'crm:company:delete', description: 'Delete companies' },
      { code: 'crm:contact:read', description: 'View contacts' },
      { code: 'crm:contact:create', description: 'Create contacts' },
      { code: 'crm:contact:update', description: 'Update contacts' },
      { code: 'crm:contact:delete', description: 'Delete contacts' },
      { code: 'crm:lead:read', description: 'View leads' },
      { code: 'crm:lead:create', description: 'Create leads' },
      { code: 'crm:lead:update', description: 'Update leads' },
      { code: 'crm:lead:delete', description: 'Delete leads' },
      { code: 'crm:opportunity:read', description: 'View opportunities' },
      { code: 'crm:opportunity:create', description: 'Create opportunities' },
      { code: 'crm:opportunity:update', description: 'Update opportunities' },
      { code: 'crm:opportunity:delete', description: 'Delete opportunities' },
      { code: 'crm:pipeline:read', description: 'View pipelines' },
      { code: 'crm:pipeline:create', description: 'Create pipelines' },
      { code: 'crm:pipeline:update', description: 'Update pipelines' },
      { code: 'crm:pipeline:delete', description: 'Delete pipelines' },

      // Product permissions
      { code: 'product:read', description: 'View products' },
      { code: 'product:create', description: 'Create products' },
      { code: 'product:update', description: 'Update products' },
      { code: 'product:delete', description: 'Delete products' },

      // Sales permissions
      { code: 'sales:quote:read', description: 'View sales quotes' },
      { code: 'sales:quote:create', description: 'Create sales quotes' },
      { code: 'sales:quote:update', description: 'Update sales quotes' },
      { code: 'sales:quote:delete', description: 'Delete sales quotes' },
      { code: 'sales:order:read', description: 'View sales orders' },
      { code: 'sales:order:create', description: 'Create sales orders' },
      { code: 'sales:order:update', description: 'Update sales orders' },
      { code: 'sales:order:delete', description: 'Delete sales orders' },

      // Accounting permissions
      { code: 'accounting:account:read', description: 'View accounts' },
      { code: 'accounting:account:create', description: 'Create accounts' },
      { code: 'accounting:account:update', description: 'Update accounts' },
      { code: 'accounting:account:delete', description: 'Delete accounts' },
      { code: 'accounting:journal:read', description: 'View journal entries' },
      { code: 'accounting:journal:create', description: 'Create journal entries' },
      { code: 'accounting:journal:update', description: 'Update journal entries' },
      { code: 'accounting:journal:delete', description: 'Delete journal entries' },
      { code: 'accounting:invoice:read', description: 'View invoices' },
      { code: 'accounting:invoice:create', description: 'Create invoices' },
      { code: 'accounting:invoice:update', description: 'Update invoices' },
      { code: 'accounting:invoice:delete', description: 'Delete invoices' },
      { code: 'accounting:payment:read', description: 'View payments' },
      { code: 'accounting:payment:create', description: 'Create payments' },
      { code: 'accounting:payment:update', description: 'Update payments' },
      { code: 'accounting:payment:delete', description: 'Delete payments' },
      { code: 'accounting:bank:read', description: 'View bank accounts' },
      { code: 'accounting:bank:create', description: 'Create bank accounts' },
      { code: 'accounting:bank:update', description: 'Update bank accounts' },
      { code: 'accounting:bank:delete', description: 'Delete bank accounts' },
      { code: 'accounting:tax:read', description: 'View tax rules' },
      { code: 'accounting:tax:create', description: 'Create tax rules' },
      { code: 'accounting:tax:update', description: 'Update tax rules' },
      { code: 'accounting:tax:delete', description: 'Delete tax rules' },
      { code: 'accounting:report:read', description: 'View financial reports' },

      // HR permissions
      { code: 'hr:employee:read', description: 'View employees' },
      { code: 'hr:employee:create', description: 'Create employees' },
      { code: 'hr:employee:update', description: 'Update employees' },
      { code: 'hr:employee:delete', description: 'Delete employees' },
      { code: 'hr:attendance:read', description: 'View attendance logs' },
      { code: 'hr:attendance:create', description: 'Clock in/out' },
      { code: 'hr:leave:read', description: 'View leave requests' },
      { code: 'hr:leave:create', description: 'Create leave requests' },
      { code: 'hr:leave:update', description: 'Update leave requests' },
      { code: 'hr:leave:approve', description: 'Approve/reject leave requests' },
      { code: 'hr:expense:read', description: 'View expense claims' },
      { code: 'hr:expense:create', description: 'Create expense claims' },
      { code: 'hr:expense:update', description: 'Update expense claims' },
      { code: 'hr:expense:approve', description: 'Approve/reject expense claims' },
      { code: 'hr:payroll:read', description: 'View payroll configs and payslips' },
      { code: 'hr:payroll:create', description: 'Create payroll configs' },
      { code: 'hr:payroll:update', description: 'Update payroll configs' },

      // Projects permissions
      { code: 'projects:project:read', description: 'View projects' },
      { code: 'projects:project:create', description: 'Create projects' },
      { code: 'projects:project:update', description: 'Update projects' },
      { code: 'projects:project:delete', description: 'Delete projects' },
      { code: 'projects:task:read', description: 'View tasks' },
      { code: 'projects:task:create', description: 'Create tasks' },
      { code: 'projects:task:update', description: 'Update tasks' },
      { code: 'projects:task:delete', description: 'Delete tasks' },
      { code: 'projects:timesheet:read', description: 'View timesheets' },
      { code: 'projects:timesheet:create', description: 'Create timesheets' },
      { code: 'projects:timesheet:update', description: 'Update timesheets' },
      { code: 'projects:timesheet:delete', description: 'Delete timesheets' },

      // Helpdesk permissions
      { code: 'helpdesk:ticket:read', description: 'View tickets' },
      { code: 'helpdesk:ticket:create', description: 'Create tickets' },
      { code: 'helpdesk:ticket:update', description: 'Update tickets' },
      { code: 'helpdesk:ticket:delete', description: 'Delete tickets' },
      { code: 'helpdesk:ticket:assign', description: 'Assign tickets' },
      { code: 'helpdesk:sla:read', description: 'View SLA rules' },
      { code: 'helpdesk:sla:create', description: 'Create SLA rules' },
      { code: 'helpdesk:sla:update', description: 'Update SLA rules' },
      { code: 'helpdesk:sla:delete', description: 'Delete SLA rules' },
    ];

    for (const permission of permissions) {
      await dataSource.query(
        `INSERT INTO permissions (code, description) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING`,
        [permission.code, permission.description],
      );
    }

    // Create demo tenant
    console.log('Creating demo tenant...');
    const [tenant] = await dataSource.query(
      `INSERT INTO tenants (name, slug, plan, "isActive", "logoUrl", "primaryColor", locale, timezone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (slug) DO UPDATE SET name = $1
       RETURNING id`,
      [
        'Demo Corporation',
        'demo-corp',
        'professional',
        true,
        null,
        '#3B82F6',
        'en',
        'America/New_York',
      ],
    );

    const tenantId = tenant.id;
    console.log(`✅ Created tenant: ${tenantId}`);

    // Create owner role
    console.log('Creating owner role...');
    const [ownerRole] = await dataSource.query(
      `INSERT INTO roles ("tenantId", name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT ("tenantId", name) DO UPDATE SET description = $3
       RETURNING id`,
      [tenantId, 'owner', 'Owner with full system access'],
    );

    // Assign all permissions to owner role
    const allPermissions = await dataSource.query(`SELECT id FROM permissions`);
    for (const permission of allPermissions) {
      await dataSource.query(
        `INSERT INTO role_permissions ("roleId", "permissionId")
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [ownerRole.id, permission.id],
      );
    }

    // Create admin role
    console.log('Creating admin role...');
    const [adminRole] = await dataSource.query(
      `INSERT INTO roles ("tenantId", name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT ("tenantId", name) DO UPDATE SET description = $3
       RETURNING id`,
      [tenantId, 'admin', 'Administrator with most permissions'],
    );

    // Assign most permissions to admin (exclude tenant delete)
    const adminPermissions = allPermissions.filter((p: any) =>
      ![
        'core:tenants:delete',
        'core:users:delete',
      ].includes(p.code),
    );
    for (const permission of adminPermissions) {
      await dataSource.query(
        `INSERT INTO role_permissions ("roleId", "permissionId")
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [adminRole.id, permission.id],
      );
    }

    // Create user role
    console.log('Creating user role...');
    const [userRole] = await dataSource.query(
      `INSERT INTO roles ("tenantId", name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT ("tenantId", name) DO UPDATE SET description = $3
       RETURNING id`,
      [tenantId, 'user', 'Standard user with basic access'],
    );

    // Assign basic permissions to user role
    const userPermissions = await dataSource.query(
      `SELECT id FROM permissions WHERE code IN ($1, $2, $3, $4, $5)`,
      [
        'core:users:read',
        'core:settings:read',
        'core:files:read',
        'core:files:upload',
        'core:notifications:read',
      ],
    );
    for (const permission of userPermissions) {
      await dataSource.query(
        `INSERT INTO role_permissions ("roleId", "permissionId")
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [userRole.id, permission.id],
      );
    }

    // Create demo owner user
    console.log('Creating demo owner user...');
    const ownerPassword = await argon2.hash('Demo123!');
    const [ownerUser] = await dataSource.query(
      `INSERT INTO users ("tenantId", email, "displayName", "passwordHash", "isActive")
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET "displayName" = $3
       RETURNING id`,
      [tenantId, 'demo@nexuserp.com', 'Demo Owner', ownerPassword, true],
    );

    // Assign owner role to owner user
    await dataSource.query(
      `INSERT INTO user_roles ("userId", "roleId")
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [ownerUser.id, ownerRole.id],
    );

    // Create demo admin user
    console.log('Creating demo admin user...');
    const adminPassword = await argon2.hash('Admin123!');
    const [adminUser] = await dataSource.query(
      `INSERT INTO users ("tenantId", email, "displayName", "passwordHash", "isActive")
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET "displayName" = $3
       RETURNING id`,
      [tenantId, 'admin@nexuserp.com', 'Demo Admin', adminPassword, true],
    );

    // Assign admin role to admin user
    await dataSource.query(
      `INSERT INTO user_roles ("userId", "roleId")
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [adminUser.id, adminRole.id],
    );

    // Create some default settings
    console.log('Creating default settings...');
    const defaultSettings = [
      {
        key: 'ui.theme.primaryColor',
        value: { color: '#3B82F6' },
      },
      {
        key: 'locale.defaultTimezone',
        value: { timezone: 'America/New_York' },
      },
      {
        key: 'security.password.minLength',
        value: { length: 8 },
      },
    ];

    for (const setting of defaultSettings) {
      await dataSource.query(
        `INSERT INTO settings ("tenantId", scope, key, value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("tenantId", scope, key) DO UPDATE SET value = $4`,
        [tenantId, 'tenant', setting.key, JSON.stringify(setting.value)],
      );
    }

    // Seed base chart of accounts
    console.log('Creating base chart of accounts...');
    const baseAccounts = [
      // Assets
      { code: '1000', name: 'Cash and Cash Equivalents', type: 'asset', isSystem: true },
      { code: '1100', name: 'Bank Accounts', type: 'asset', isSystem: true },
      { code: '1200', name: 'Accounts Receivable', type: 'asset', isSystem: true },
      { code: '1300', name: 'Inventory', type: 'asset', isSystem: true },
      { code: '1400', name: 'Prepaid Expenses', type: 'asset', isSystem: true },
      { code: '1500', name: 'Fixed Assets', type: 'asset', isSystem: true },
      { code: '1510', name: 'Equipment', type: 'asset', isSystem: false },
      { code: '1520', name: 'Accumulated Depreciation', type: 'asset', isSystem: false },

      // Liabilities
      { code: '2000', name: 'Current Liabilities', type: 'liability', isSystem: true },
      { code: '2100', name: 'Accounts Payable', type: 'liability', isSystem: true },
      { code: '2200', name: 'Tax Payable', type: 'liability', isSystem: true },
      { code: '2300', name: 'Accrued Expenses', type: 'liability', isSystem: false },
      { code: '2400', name: 'Long-term Debt', type: 'liability', isSystem: false },

      // Equity
      { code: '3000', name: 'Equity', type: 'equity', isSystem: true },
      { code: '3100', name: 'Owner\'s Equity', type: 'equity', isSystem: true },
      { code: '3200', name: 'Retained Earnings', type: 'equity', isSystem: true },

      // Income
      { code: '4000', name: 'Revenue', type: 'income', isSystem: true },
      { code: '4100', name: 'Sales Revenue', type: 'income', isSystem: true },
      { code: '4200', name: 'Service Revenue', type: 'income', isSystem: false },
      { code: '4300', name: 'Other Income', type: 'income', isSystem: false },

      // Expenses
      { code: '5000', name: 'Cost of Goods Sold', type: 'expense', isSystem: true },
      { code: '6000', name: 'Operating Expenses', type: 'expense', isSystem: true },
      { code: '6100', name: 'Salaries and Wages', type: 'expense', isSystem: false },
      { code: '6200', name: 'Rent', type: 'expense', isSystem: false },
      { code: '6300', name: 'Utilities', type: 'expense', isSystem: false },
      { code: '6400', name: 'Marketing and Advertising', type: 'expense', isSystem: false },
      { code: '6500', name: 'Professional Fees', type: 'expense', isSystem: false },
      { code: '6600', name: 'Office Supplies', type: 'expense', isSystem: false },
      { code: '6700', name: 'Depreciation', type: 'expense', isSystem: false },
    ];

    for (const account of baseAccounts) {
      await dataSource.query(
        `INSERT INTO accounts ("tenantId", code, name, type, "isActive", "isSystem")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (code) DO NOTHING`,
        [tenantId, account.code, account.name, account.type, true, account.isSystem],
      );
    }

    // Seed sample tax rules
    console.log('Creating sample tax rules...');
    const taxRules = [
      { name: 'Standard VAT', code: 'VAT-STANDARD', rate: 20.0, type: 'exclusive', region: 'UK' },
      { name: 'Reduced VAT', code: 'VAT-REDUCED', rate: 5.0, type: 'exclusive', region: 'UK' },
      { name: 'Sales Tax', code: 'SALES-TAX', rate: 8.5, type: 'exclusive', region: 'US' },
    ];

    for (const taxRule of taxRules) {
      await dataSource.query(
        `INSERT INTO tax_rules ("tenantId", name, code, rate, type, region, "isActive")
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (code) DO NOTHING`,
        [tenantId, taxRule.name, taxRule.code, taxRule.rate, taxRule.type, taxRule.region, true],
      );
    }

    // Add accounting settings
    console.log('Creating accounting settings...');
    const accountingSettings = [
      { key: 'accounting.base_currency', value: 'USD' },
      { key: 'accounting.tax.inclusive_by_default', value: false },
      { key: 'accounting.invoice.payment_terms_default_days', value: 30 },
      { key: 'accounting.aging.buckets', value: [30, 60, 90] },
    ];

    for (const setting of accountingSettings) {
      await dataSource.query(
        `INSERT INTO settings ("tenantId", scope, key, value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("tenantId", scope, key) DO UPDATE SET value = $4`,
        [tenantId, 'tenant', setting.key, JSON.stringify(setting.value)],
      );
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('  Owner:');
    console.log('    Email: demo@nexuserp.com');
    console.log('    Password: Demo123!');
    console.log('  Admin:');
    console.log('    Email: admin@nexuserp.com');
    console.log('    Password: Admin123!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seed()
  .then(() => {
    console.log('✅ Seed process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  });
