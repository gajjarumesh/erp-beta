import {
  LayoutDashboard,
  UserCircle,
  ShoppingCart,
  Package,
  ShoppingBag,
  Receipt,
  Wallet,
  Users,
  DollarSign,
  FolderKanban,
  Globe,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface ModuleConfig {
  id: string
  name: string
  description: string
  icon: LucideIcon
  href: string
  color: string
  category: 'core' | 'sales' | 'operations' | 'finance' | 'hr' | 'productivity'
  enabled: boolean
  requiredPlan?: 'free' | 'starter' | 'professional' | 'enterprise'
  subModules?: {
    id: string
    name: string
    href: string
  }[]
}

export const moduleRegistry: ModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Overview and analytics',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'from-blue-500 to-blue-600',
    category: 'core',
    enabled: true,
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Manage leads and opportunities',
    icon: UserCircle,
    href: '/crm',
    color: 'from-purple-500 to-purple-600',
    category: 'sales',
    enabled: true,
    subModules: [
      { id: 'leads', name: 'Leads', href: '/crm/leads' },
      { id: 'opportunities', name: 'Opportunities', href: '/crm/opportunities' },
      { id: 'activities', name: 'Activities', href: '/crm/activities' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Orders, quotations, and customers',
    icon: ShoppingCart,
    href: '/sales',
    color: 'from-indigo-500 to-indigo-600',
    category: 'sales',
    enabled: true,
    subModules: [
      { id: 'orders', name: 'Orders', href: '/sales' },
      { id: 'customers', name: 'Customers', href: '/sales/customers' },
      { id: 'quotations', name: 'Quotations', href: '/sales/quotations' },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Products and stock management',
    icon: Package,
    href: '/inventory',
    color: 'from-orange-500 to-orange-600',
    category: 'operations',
    enabled: true,
    subModules: [
      { id: 'products', name: 'Products', href: '/inventory/products' },
      { id: 'warehouses', name: 'Warehouses', href: '/inventory/warehouses' },
      { id: 'stock-moves', name: 'Stock Moves', href: '/inventory/stock-moves' },
    ],
  },
  {
    id: 'purchase',
    name: 'Purchase',
    description: 'Vendor orders and procurement',
    icon: ShoppingBag,
    href: '/purchase',
    color: 'from-teal-500 to-teal-600',
    category: 'operations',
    enabled: true,
    subModules: [
      { id: 'orders', name: 'Purchase Orders', href: '/purchase' },
      { id: 'vendors', name: 'Vendors', href: '/purchase/vendors' },
      { id: 'rfq', name: 'RFQ', href: '/purchase/rfq' },
    ],
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Invoices, payments, and finances',
    icon: Receipt,
    href: '/accounting',
    color: 'from-green-500 to-green-600',
    category: 'finance',
    enabled: true,
    subModules: [
      { id: 'invoices', name: 'Invoices', href: '/accounting/invoices' },
      { id: 'payments', name: 'Payments', href: '/accounting/payments' },
      { id: 'journal', name: 'Journal', href: '/accounting/journal' },
    ],
  },
  {
    id: 'expenses',
    name: 'Expenses',
    description: 'Expense tracking and reimbursements',
    icon: Wallet,
    href: '/expenses',
    color: 'from-rose-500 to-rose-600',
    category: 'finance',
    enabled: true,
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Employee management',
    icon: Users,
    href: '/hr',
    color: 'from-pink-500 to-pink-600',
    category: 'hr',
    enabled: true,
    subModules: [
      { id: 'employees', name: 'Employees', href: '/hr/employees' },
      { id: 'departments', name: 'Departments', href: '/hr/departments' },
      { id: 'leaves', name: 'Leave Requests', href: '/hr/leaves' },
    ],
  },
  {
    id: 'payroll',
    name: 'Payroll',
    description: 'Salary and payslips',
    icon: DollarSign,
    href: '/payroll',
    color: 'from-amber-500 to-amber-600',
    category: 'hr',
    enabled: true,
    requiredPlan: 'professional',
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Project and task management',
    icon: FolderKanban,
    href: '/projects',
    color: 'from-violet-500 to-violet-600',
    category: 'productivity',
    enabled: true,
    subModules: [
      { id: 'projects', name: 'Projects', href: '/projects' },
      { id: 'tasks', name: 'Tasks', href: '/projects/tasks' },
      { id: 'timesheets', name: 'Timesheets', href: '/projects/timesheets' },
    ],
  },
  {
    id: 'website',
    name: 'Website',
    description: 'CMS and e-commerce',
    icon: Globe,
    href: '/website',
    color: 'from-cyan-500 to-cyan-600',
    category: 'productivity',
    enabled: true,
    requiredPlan: 'professional',
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Analytics and reports',
    icon: BarChart3,
    href: '/reports',
    color: 'from-lime-500 to-lime-600',
    category: 'core',
    enabled: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System configuration',
    icon: Settings,
    href: '/settings',
    color: 'from-gray-500 to-gray-600',
    category: 'core',
    enabled: true,
  },
]

export function getModuleById(id: string): ModuleConfig | undefined {
  return moduleRegistry.find(m => m.id === id)
}

export function getModulesByCategory(category: ModuleConfig['category']): ModuleConfig[] {
  return moduleRegistry.filter(m => m.category === category)
}

export function getEnabledModules(): ModuleConfig[] {
  return moduleRegistry.filter(m => m.enabled)
}

export default moduleRegistry
