'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Star,
  StarOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { StatCard } from '@/components/ui/stat-card'
import { formatCurrency } from '@/lib/utils'

// Sample customer data
const customers = [
  {
    id: 'CUST-001',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 555-123-4567',
    address: '123 Business Ave, New York, NY 10001',
    type: 'Enterprise',
    totalOrders: 45,
    totalSpent: 156780.00,
    lastOrder: '2024-01-15',
    status: 'Active',
    isFavorite: true,
    avatar: 'AC',
  },
  {
    id: 'CUST-002',
    name: 'TechStart Inc.',
    email: 'orders@techstart.com',
    phone: '+1 555-234-5678',
    address: '456 Innovation Blvd, San Francisco, CA 94102',
    type: 'SMB',
    totalOrders: 23,
    totalSpent: 87450.00,
    lastOrder: '2024-01-14',
    status: 'Active',
    isFavorite: true,
    avatar: 'TI',
  },
  {
    id: 'CUST-003',
    name: 'Global Industries',
    email: 'procurement@global.com',
    phone: '+1 555-345-6789',
    address: '789 Industrial Park, Chicago, IL 60601',
    type: 'Enterprise',
    totalOrders: 67,
    totalSpent: 234100.00,
    lastOrder: '2024-01-13',
    status: 'Active',
    isFavorite: false,
    avatar: 'GI',
  },
  {
    id: 'CUST-004',
    name: 'Smart Solutions',
    email: 'hello@smart-solutions.io',
    phone: '+1 555-456-7890',
    address: '321 Tech Lane, Austin, TX 78701',
    type: 'Startup',
    totalOrders: 12,
    totalSpent: 34560.00,
    lastOrder: '2024-01-12',
    status: 'Active',
    isFavorite: false,
    avatar: 'SS',
  },
  {
    id: 'CUST-005',
    name: 'Prime Retail',
    email: 'buying@primeretail.com',
    phone: '+1 555-567-8901',
    address: '654 Retail Row, Los Angeles, CA 90001',
    type: 'Enterprise',
    totalOrders: 89,
    totalSpent: 456780.00,
    lastOrder: '2024-01-11',
    status: 'Inactive',
    isFavorite: false,
    avatar: 'PR',
  },
]

const customerTypes = ['All', 'Enterprise', 'SMB', 'Startup']

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'All' || customer.type === selectedType
    return matchesSearch && matchesType
  })

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === 'Active').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your customer relationships and information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers.toString()}
          icon={Building2}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Active Customers"
          value={activeCustomers.toString()}
          icon={Star}
          trend={{ value: 8.2, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={Building2}
          trend={{ value: 15.3, isPositive: true }}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Avg. Order Value"
          value={formatCurrency(avgOrderValue)}
          icon={Building2}
          trend={{ value: 5.8, isPositive: true }}
          color="yellow"
          delay={0.3}
        />
      </div>

      {/* Filters */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-4">
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="max-w-sm"
                />
                <div className="flex gap-2">
                  {customerTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Customers Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCustomers.map((customer) => (
              <motion.div key={customer.id} variants={item}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {customer.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {customer.name}
                          </h3>
                          <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'}>
                            {customer.status}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => {}}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {customer.isFavorite ? (
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Total Orders</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {customer.totalOrders}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 dark:text-gray-400">Total Spent</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(customer.totalSpent)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setShowDetailModal(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={item}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            <Card hover={false}>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Orders
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Total Spent
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {customer.avatar}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {customer.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {customer.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {customer.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {customer.phone}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary">{customer.type}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {customer.totalOrders}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(customer.totalSpent)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'}>
                              {customer.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCustomer(customer)
                                  setShowDetailModal(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Customer"
        description="Enter customer information to create a new customer record"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name *
              </label>
              <Input placeholder="Enter company name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer Type
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Enterprise</option>
                <option>SMB</option>
                <option>Startup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <Input type="email" placeholder="contact@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <Input type="tel" placeholder="+1 555-123-4567" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <Input placeholder="Street address" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <Input placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <Input placeholder="Country" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tax ID
              </label>
              <Input placeholder="Tax ID / VAT Number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Credit Limit
              </label>
              <Input type="number" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              rows={3}
              placeholder="Add any notes about this customer..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Customer</Button>
          </div>
        </form>
      </Modal>

      {/* Customer Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedCustomer?.name || 'Customer Details'}
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {selectedCustomer.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedCustomer.name}
                  </h3>
                  <Badge variant={selectedCustomer.status === 'Active' ? 'success' : 'secondary'}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{selectedCustomer.type}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Order Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCustomer.totalOrders}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedCustomer.totalSpent)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Order</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Order</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCustomer.lastOrder}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Orders</h4>
              <div className="space-y-2">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">SO-2024-00{i + 1}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(2024, 0, 15 - i).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency([3245, 1876, 4521][i])}
                      </p>
                      <Badge variant="success">Delivered</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
