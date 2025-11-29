import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Company
  const company = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1 800 123 4567',
      address: '123 Business Street, Suite 100',
      city: 'San Francisco',
      country: 'United States',
      taxId: 'US123456789',
    },
  })
  console.log('✅ Created company:', company.name)

  // Create Users
  // NOTE: This is seed data for development/demo purposes only.
  // In production, passwords should be properly hashed using bcrypt or similar.
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      name: 'Admin User',
      password: 'DEVELOPMENT_ONLY_CHANGE_IN_PRODUCTION', // Replace with proper hashed password in production
      role: 'ADMIN',
      companyId: company.id,
    },
  })
  console.log('✅ Created admin user:', adminUser.email)

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: { name: 'Engineering', description: 'Software Development', companyId: company.id },
    }),
    prisma.department.create({
      data: { name: 'Marketing', description: 'Marketing and Communications', companyId: company.id },
    }),
    prisma.department.create({
      data: { name: 'Sales', description: 'Sales and Business Development', companyId: company.id },
    }),
    prisma.department.create({
      data: { name: 'HR', description: 'Human Resources', companyId: company.id },
    }),
    prisma.department.create({
      data: { name: 'Finance', description: 'Finance and Accounting', companyId: company.id },
    }),
  ])
  console.log('✅ Created departments:', departments.length)

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Electronics', description: 'Electronic devices and gadgets' } }),
    prisma.category.create({ data: { name: 'Accessories', description: 'Device accessories' } }),
    prisma.category.create({ data: { name: 'Wearables', description: 'Wearable technology' } }),
    prisma.category.create({ data: { name: 'Software', description: 'Software licenses and subscriptions' } }),
  ])
  console.log('✅ Created categories:', categories.length)

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'MacBook Pro 16"',
        sku: 'MBP-16-M3',
        description: 'Apple MacBook Pro 16-inch with M3 chip',
        categoryId: categories[0].id,
        price: 2499.00,
        cost: 2000.00,
        quantity: 45,
        minQuantity: 10,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        sku: 'IP15-PRO-256',
        description: 'Apple iPhone 15 Pro 256GB',
        categoryId: categories[0].id,
        price: 1099.00,
        cost: 850.00,
        quantity: 120,
        minQuantity: 20,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'iPad Air',
        sku: 'IPA-5-64',
        description: 'Apple iPad Air 5th Gen 64GB',
        categoryId: categories[0].id,
        price: 599.00,
        cost: 450.00,
        quantity: 80,
        minQuantity: 25,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'AirPods Pro',
        sku: 'APP-2GEN',
        description: 'Apple AirPods Pro 2nd Generation',
        categoryId: categories[1].id,
        price: 249.00,
        cost: 180.00,
        quantity: 200,
        minQuantity: 50,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Apple Watch Ultra',
        sku: 'AWU-2-49',
        description: 'Apple Watch Ultra 2 49mm',
        categoryId: categories[2].id,
        price: 799.00,
        cost: 600.00,
        quantity: 67,
        minQuantity: 15,
        companyId: company.id,
      },
    }),
  ])
  console.log('✅ Created products:', products.length)

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'TechCorp Inc.',
        email: 'orders@techcorp.com',
        phone: '+1 555 123 4567',
        address: '456 Tech Avenue',
        city: 'New York',
        country: 'United States',
        companyId: company.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Global Industries',
        email: 'purchasing@global.com',
        phone: '+1 555 234 5678',
        address: '789 Global Plaza',
        city: 'Chicago',
        country: 'United States',
        companyId: company.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'StartUp Solutions',
        email: 'hello@startup.io',
        phone: '+1 555 345 6789',
        address: '321 Innovation Way',
        city: 'Austin',
        country: 'United States',
        companyId: company.id,
      },
    }),
  ])
  console.log('✅ Created customers:', customers.length)

  // Create Warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse',
      code: 'WH-MAIN',
      address: '100 Warehouse Road',
      city: 'San Francisco',
      country: 'United States',
      companyId: company.id,
    },
  })
  console.log('✅ Created warehouse:', warehouse.name)

  // Create Employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        employeeId: 'EMP-001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@acme.com',
        phone: '+1 234 567 8901',
        jobTitle: 'Senior Developer',
        departmentId: departments[0].id,
        companyId: company.id,
        salary: 95000,
        hireDate: new Date('2022-03-15'),
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP-002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@acme.com',
        phone: '+1 234 567 8902',
        jobTitle: 'Marketing Manager',
        departmentId: departments[1].id,
        companyId: company.id,
        salary: 85000,
        hireDate: new Date('2021-08-20'),
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP-003',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'm.brown@acme.com',
        phone: '+1 234 567 8903',
        jobTitle: 'Sales Representative',
        departmentId: departments[2].id,
        companyId: company.id,
        salary: 55000,
        hireDate: new Date('2023-01-10'),
      },
    }),
  ])
  console.log('✅ Created employees:', employees.length)

  // Create Sales Orders
  const order1 = await prisma.salesOrder.create({
    data: {
      orderNumber: 'SO-2024-001',
      customerId: customers[0].id,
      companyId: company.id,
      status: 'DELIVERED',
      subtotal: 5247.00,
      tax: 420.00,
      total: 5667.00,
      orderLines: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: 2499.00,
            subtotal: 4998.00,
          },
          {
            productId: products[3].id,
            quantity: 1,
            unitPrice: 249.00,
            subtotal: 249.00,
          },
        ],
      },
    },
  })
  console.log('✅ Created sales order:', order1.orderNumber)

  // Create Invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-001',
      customerId: customers[0].id,
      companyId: company.id,
      orderId: order1.id,
      status: 'PAID',
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      subtotal: 5247.00,
      tax: 420.00,
      total: 5667.00,
      paidAmount: 5667.00,
    },
  })
  console.log('✅ Created invoice:', invoice1.invoiceNumber)

  // Create Leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: 'Robert Chen',
        email: 'robert.chen@techcorp.com',
        phone: '+1 555 123 4567',
        company: 'TechCorp Inc.',
        source: 'WEBSITE',
        status: 'QUALIFIED',
        expectedValue: 45000,
        probability: 75,
        companyId: company.id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Lisa Wang',
        email: 'lisa.w@innovate.io',
        phone: '+1 555 234 5678',
        company: 'Innovate Solutions',
        source: 'REFERRAL',
        status: 'PROPOSAL',
        expectedValue: 78000,
        probability: 60,
        companyId: company.id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'James Miller',
        email: 'j.miller@startup.co',
        phone: '+1 555 345 6789',
        company: 'StartUp Co',
        source: 'SOCIAL_MEDIA',
        status: 'NEW',
        expectedValue: 25000,
        probability: 20,
        companyId: company.id,
      },
    }),
  ])
  console.log('✅ Created leads:', leads.length)

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
