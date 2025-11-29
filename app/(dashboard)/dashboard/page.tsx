'use client'

import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChartWrapper,
  LineChart,
  BarChart,
  DoughnutChart,
} from '@/components/charts/charts'
import { formatCurrency } from '@/lib/utils'

// Sample data for charts
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Sales',
      data: [30000, 45000, 35000, 50000, 42000, 55000, 48000, 62000, 58000, 70000, 65000, 78000],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
  ],
}

const revenueData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 19000, 15000, 22000, 18000, 24000, 20000],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'],
    },
  ],
}

const categoryData = {
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'],
  data: [35, 25, 20, 12, 8],
}

const recentOrders = [
  { id: 'SO-001', customer: 'John Smith', amount: 1234.56, status: 'Completed' },
  { id: 'SO-002', customer: 'Jane Doe', amount: 567.89, status: 'Processing' },
  { id: 'SO-003', customer: 'Bob Johnson', amount: 890.12, status: 'Pending' },
  { id: 'SO-004', customer: 'Alice Brown', amount: 345.67, status: 'Completed' },
  { id: 'SO-005', customer: 'Charlie Wilson', amount: 1567.89, status: 'Shipped' },
]

const topProducts = [
  { name: 'MacBook Pro 16"', sales: 234, revenue: 584850 },
  { name: 'iPhone 15 Pro', sales: 456, revenue: 502140 },
  { name: 'iPad Air', sales: 189, revenue: 113211 },
  { name: 'AirPods Pro', sales: 567, revenue: 141750 },
  { name: 'Apple Watch', sales: 345, revenue: 137655 },
]

const statusColors: Record<string, 'success' | 'warning' | 'default' | 'secondary'> = {
  Completed: 'success',
  Processing: 'warning',
  Pending: 'default',
  Shipped: 'secondary',
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

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back! Here&apos;s what&apos;s happening with your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(124567.89)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Orders"
          value="1,234"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Products"
          value="456"
          icon={Package}
          trend={{ value: 3.1, isPositive: false }}
          color="yellow"
          delay={0.2}
        />
        <StatCard
          title="Customers"
          value="789"
          icon={Users}
          trend={{ value: 15.3, isPositive: true }}
          color="purple"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Sales Overview"
          description="Monthly sales performance"
          delay={0.4}
        >
          <LineChart
            labels={salesData.labels}
            datasets={salesData.datasets}
            height={300}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Weekly Revenue"
          description="Revenue breakdown by day"
          delay={0.5}
        >
          <BarChart
            labels={revenueData.labels}
            datasets={revenueData.datasets}
            height={300}
          />
        </ChartWrapper>
      </div>

      {/* Tables and Doughnut */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card hover={false}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <a
                href="/sales"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                View all
              </a>
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
                        Amount
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                      >
                        <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                          {order.customer}
                        </td>
                        <td className="py-3 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="py-3">
                          <Badge variant={statusColors[order.status]}>
                            {order.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Chart */}
        <ChartWrapper
          title="Product Categories"
          description="Sales by category"
          delay={0.6}
        >
          <DoughnutChart
            labels={categoryData.labels}
            data={categoryData.data}
            height={250}
          />
        </ChartWrapper>
      </div>

      {/* Top Products */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Selling Products</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.sales} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-sm text-green-600 dark:text-green-400">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>12%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
