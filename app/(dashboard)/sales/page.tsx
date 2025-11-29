'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  TrendingUp,
  Users,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { Modal } from '@/components/ui/modal'
import { ChartWrapper, LineChart, BarChart } from '@/components/charts/charts'
import { formatCurrency, formatDate } from '@/lib/utils'

// Sample data
const orders = [
  {
    id: 'SO-2024-001',
    customer: 'Acme Corporation',
    date: '2024-01-15',
    amount: 15670.00,
    status: 'Delivered',
    items: 12,
  },
  {
    id: 'SO-2024-002',
    customer: 'TechStart Inc.',
    date: '2024-01-14',
    amount: 8450.00,
    status: 'Shipped',
    items: 5,
  },
  {
    id: 'SO-2024-003',
    customer: 'Global Industries',
    date: '2024-01-13',
    amount: 23100.00,
    status: 'Processing',
    items: 18,
  },
  {
    id: 'SO-2024-004',
    customer: 'Smart Solutions',
    date: '2024-01-12',
    amount: 6780.00,
    status: 'Confirmed',
    items: 8,
  },
  {
    id: 'SO-2024-005',
    customer: 'Prime Retail',
    date: '2024-01-11',
    amount: 34500.00,
    status: 'Draft',
    items: 25,
  },
  {
    id: 'SO-2024-006',
    customer: 'NextGen Labs',
    date: '2024-01-10',
    amount: 12890.00,
    status: 'Delivered',
    items: 10,
  },
]

const salesTrendData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Sales',
      data: [45000, 52000, 48000, 61000],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
  ],
}

const topCustomersData = {
  labels: ['Acme Corp', 'TechStart', 'Global Ind.', 'Smart Sol.', 'Prime Retail'],
  datasets: [
    {
      label: 'Revenue',
      data: [45000, 38000, 32000, 28000, 24000],
    },
  ],
}

const statusColors: Record<string, 'success' | 'warning' | 'default' | 'secondary' | 'danger'> = {
  Delivered: 'success',
  Shipped: 'secondary',
  Processing: 'warning',
  Confirmed: 'default',
  Draft: 'secondary',
  Cancelled: 'danger',
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            Sales
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your sales orders and customers
          </p>
        </div>
        <Button onClick={() => setShowNewOrderModal(true)}>
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={formatCurrency(101390)}
          icon={ShoppingCart}
          trend={{ value: 18.2, isPositive: true }}
          color="green"
          delay={0}
        />
        <StatCard
          title="Orders"
          value="78"
          icon={FileText}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
          delay={0.1}
        />
        <StatCard
          title="Customers"
          value="34"
          icon={Users}
          trend={{ value: 8.1, isPositive: true }}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Avg. Order Value"
          value={formatCurrency(1300.00)}
          icon={TrendingUp}
          trend={{ value: 5.3, isPositive: true }}
          color="yellow"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Sales Trend"
          description="Weekly sales performance"
          delay={0.4}
        >
          <LineChart
            labels={salesTrendData.labels}
            datasets={salesTrendData.datasets}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Top Customers"
          description="Revenue by customer"
          delay={0.5}
        >
          <BarChart
            labels={topCustomersData.labels}
            datasets={topCustomersData.datasets}
            height={250}
            horizontal
          />
        </ChartWrapper>
      </div>

      {/* Orders Table */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Sales Orders</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="w-full sm:w-64"
              />
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Order ID
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Customer
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Items
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Amount
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                          {order.id}
                        </td>
                        <td className="py-4 text-sm text-gray-900 dark:text-white">
                          {order.customer}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(order.date)}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {order.items}
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="py-4">
                          <Badge variant={statusColors[order.status]}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedOrder(order)}
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
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* New Order Modal */}
      <Modal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        title="Create New Order"
        description="Fill in the details to create a new sales order"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer
              </label>
              <Input placeholder="Select customer..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order Date
              </label>
              <Input type="date" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              rows={3}
              placeholder="Add any notes..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowNewOrderModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </div>
        </form>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedOrder.customer}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedOrder.date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedOrder.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant={statusColors[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Items ({selectedOrder.items})
              </p>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Order items would be listed here...
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
