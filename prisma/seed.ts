import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Company
  const company = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
      slug: 'acme-corporation',
      email: 'contact@acme.com',
      phone: '+1 800 123 4567',
      address: '123 Business Street, Suite 100',
      city: 'San Francisco',
      country: 'United States',
      taxId: 'US123456789',
    },
  })
  console.log('✅ Created company:', company.name)

  // Create Users with hashed passwords
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company.id,
    },
  })
  console.log('✅ Created admin user:', adminUser.email)

  // Create Manager user
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      name: 'Manager User',
      password: hashedPassword,
      role: 'MANAGER',
      companyId: company.id,
    },
  })
  console.log('✅ Created manager user:', managerUser.email)

  // Create regular user
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Regular User',
      password: hashedPassword,
      role: 'USER',
      companyId: company.id,
    },
  })
  console.log('✅ Created regular user:', regularUser.email)

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
    prisma.category.create({ data: { name: 'Electronics', description: 'Electronic devices and gadgets', companyId: company.id } }),
    prisma.category.create({ data: { name: 'Accessories', description: 'Device accessories', companyId: company.id } }),
    prisma.category.create({ data: { name: 'Wearables', description: 'Wearable technology', companyId: company.id } }),
    prisma.category.create({ data: { name: 'Software', description: 'Software licenses and subscriptions', companyId: company.id } }),
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

  // Create Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Website Redesign',
        description: 'Complete redesign of the company website with modern UI',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        budget: 50000,
        progress: 45,
        managerId: adminUser.id,
        companyId: company.id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'Mobile App Development',
        description: 'Native mobile app for iOS and Android',
        status: 'PLANNING',
        priority: 'MEDIUM',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-12-31'),
        budget: 100000,
        progress: 10,
        managerId: managerUser.id,
        companyId: company.id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'ERP Integration',
        description: 'Integration of third-party ERP system',
        status: 'COMPLETED',
        priority: 'URGENT',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-12-15'),
        budget: 75000,
        progress: 100,
        managerId: adminUser.id,
        companyId: company.id,
      },
    }),
  ])
  console.log('✅ Created projects:', projects.length)

  // Create Tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Design homepage mockups',
        description: 'Create wireframes and mockups for new homepage',
        status: 'DONE',
        priority: 'HIGH',
        projectId: projects[0].id,
        assigneeId: adminUser.id,
        dueDate: new Date('2024-02-15'),
        estimatedHours: 20,
        actualHours: 18,
        companyId: company.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement responsive navigation',
        description: 'Build responsive navigation component',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: projects[0].id,
        assigneeId: managerUser.id,
        dueDate: new Date('2024-03-01'),
        estimatedHours: 16,
        actualHours: 8,
        companyId: company.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up CI/CD pipeline',
        description: 'Configure continuous integration and deployment',
        status: 'TODO',
        priority: 'HIGH',
        projectId: projects[1].id,
        dueDate: new Date('2024-04-01'),
        estimatedHours: 12,
        companyId: company.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'API Documentation',
        description: 'Write comprehensive API documentation',
        status: 'IN_REVIEW',
        priority: 'LOW',
        projectId: projects[0].id,
        assigneeId: regularUser.id,
        dueDate: new Date('2024-03-15'),
        estimatedHours: 8,
        actualHours: 6,
        companyId: company.id,
      },
    }),
  ])
  console.log('✅ Created tasks:', tasks.length)

  // Create additional Sales Orders
  const order2 = await prisma.salesOrder.create({
    data: {
      orderNumber: 'SO-2024-002',
      customerId: customers[1].id,
      companyId: company.id,
      status: 'CONFIRMED',
      subtotal: 3196.00,
      tax: 256.00,
      total: 3452.00,
      orderLines: {
        create: [
          {
            productId: products[1].id,
            quantity: 2,
            unitPrice: 1099.00,
            subtotal: 2198.00,
          },
          {
            productId: products[2].id,
            quantity: 1,
            unitPrice: 599.00,
            subtotal: 599.00,
          },
          {
            productId: products[3].id,
            quantity: 2,
            unitPrice: 249.00,
            subtotal: 498.00,
          },
        ],
      },
    },
  })
  console.log('✅ Created additional sales order:', order2.orderNumber)

  // Create Vendor
  const vendor = await prisma.vendor.create({
    data: {
      name: 'Apple Inc.',
      email: 'wholesale@apple.com',
      phone: '+1 800 275 2273',
      address: 'One Apple Park Way',
      city: 'Cupertino',
      country: 'United States',
      companyId: company.id,
    },
  })
  console.log('✅ Created vendor:', vendor.name)

  // Create Stock Moves
  const stockMoves = await Promise.all([
    prisma.stockMove.create({
      data: {
        productId: products[0].id,
        warehouseId: warehouse.id,
        moveType: 'IN',
        quantity: 50,
        reference: 'PO-2024-001',
        notes: 'Initial stock receipt',
      },
    }),
    prisma.stockMove.create({
      data: {
        productId: products[0].id,
        warehouseId: warehouse.id,
        moveType: 'OUT',
        quantity: 5,
        reference: 'SO-2024-001',
        notes: 'Sales order fulfillment',
      },
    }),
  ])
  console.log('✅ Created stock moves:', stockMoves.length)

  console.log('🎉 Seed completed successfully!')
  console.log('')
  console.log('📝 Demo Credentials:')
  console.log('   Admin: admin@example.com / password123')
  console.log('   Manager: manager@example.com / password123')
  console.log('   User: user@example.com / password123')
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
