'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronDown,
  Menu,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  subItems?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Sales',
    href: '/sales',
    icon: ShoppingCart,
    subItems: [
      { name: 'Orders', href: '/sales' },
      { name: 'Customers', href: '/sales/customers' },
      { name: 'Quotations', href: '/sales/quotations' },
    ],
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
    subItems: [
      { name: 'Overview', href: '/inventory' },
      { name: 'Products', href: '/inventory/products' },
      { name: 'Warehouses', href: '/inventory/warehouses' },
    ],
  },
  {
    name: 'Accounting',
    href: '/accounting',
    icon: Receipt,
    subItems: [
      { name: 'Overview', href: '/accounting' },
      { name: 'Invoices', href: '/accounting/invoices' },
    ],
  },
  {
    name: 'HR',
    href: '/hr',
    icon: Users,
    subItems: [
      { name: 'Overview', href: '/hr' },
      { name: 'Employees', href: '/hr/employees' },
      { name: 'Departments', href: '/hr/departments' },
    ],
  },
  {
    name: 'CRM',
    href: '/crm',
    icon: UserCircle,
    subItems: [
      { name: 'Overview', href: '/crm' },
      { name: 'Leads', href: '/crm/leads' },
    ],
  },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 80,
          x: 0,
        }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-y-auto',
          'lg:relative lg:z-0',
          !isOpen && 'max-lg:hidden'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Building2 className="h-6 w-6" />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-xl font-bold text-gray-900 dark:text-white overflow-hidden whitespace-nowrap"
                >
                  ERP System
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 pb-4">
          <ul className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const isExpanded = expandedItems.includes(item.name) || (item.subItems && pathname.startsWith(item.href))
              const Icon = item.icon
              const hasSubItems = item.subItems && item.subItems.length > 0

              return (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={cn(
                          'w-full group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn('h-5 w-5 flex-shrink-0', !isActive && 'group-hover:scale-110 transition-transform')} />
                          <AnimatePresence>
                            {isOpen && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="overflow-hidden whitespace-nowrap"
                              >
                                {item.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        {isOpen && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        )}
                      </button>
                      <AnimatePresence>
                        {isOpen && isExpanded && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-8 mt-1 space-y-1 overflow-hidden"
                          >
                            {item.subItems?.map((subItem) => {
                              const isSubActive = pathname === subItem.href
                              return (
                                <li key={subItem.href}>
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                                      isSubActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              )
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', !isActive && 'group-hover:scale-110 transition-transform')} />
                      <AnimatePresence>
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  )}
                </motion.li>
              )
            })}
          </ul>
        </nav>
      </motion.aside>
    </>
  )
}

interface MobileMenuButtonProps {
  onClick: () => void
}

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
    </button>
  )
}
