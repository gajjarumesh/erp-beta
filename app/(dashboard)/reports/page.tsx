'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'

const salesData = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Apr', value: 61000 },
  { month: 'May', value: 55000 },
  { month: 'Jun', value: 67000 },
]

const topProducts = [
  { name: 'MacBook Pro 16"', sales: 145, revenue: 362355 },
  { name: 'iPhone 15 Pro', sales: 234, revenue: 257166 },
  { name: 'iPad Air', sales: 189, revenue: 113211 },
  { name: 'AirPods Pro', sales: 312, revenue: 77688 },
  { name: 'Apple Watch Ultra', sales: 98, revenue: 78302 },
]

const topCustomers = [
  { name: 'TechCorp Inc.', orders: 24, revenue: 125000 },
  { name: 'Global Industries', orders: 18, revenue: 89500 },
  { name: 'StartUp Solutions', orders: 15, revenue: 67800 },
  { name: 'Digital Agency', orders: 12, revenue: 45200 },
  { name: 'Media Group', orders: 10, revenue: 38900 },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState('month')

  const maxSales = Math.max(...salesData.map(d => d.value))

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Analytics and business insights</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Select
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
            ]}
            value={period}
            onChange={setPeriod}
          />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$328,000</p>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,245</p>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+8.2% from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">New Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
              <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                <TrendingDown className="h-4 w-4" />
                <span>-3.1% from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Products Sold</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">978</p>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+15.3% from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Sales Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-end gap-2 h-48">
            {salesData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                  style={{ height: `${(data.value / maxSales) * 100}%` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue by Category</h3>
          <div className="space-y-4">
            {[
              { name: 'Electronics', value: 65, color: 'bg-blue-500' },
              { name: 'Accessories', value: 20, color: 'bg-purple-500' },
              { name: 'Wearables', value: 10, color: 'bg-green-500' },
              { name: 'Software', value: 5, color: 'bg-orange-500' },
            ].map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{category.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${category.color} rounded-full`}
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium text-right">Sales</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">{product.name}</td>
                    <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">{product.sales}</td>
                    <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Customers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Customers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium text-right">Orders</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">{customer.name}</td>
                    <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">{customer.orders}</td>
                    <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                      ${customer.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
