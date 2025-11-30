'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, ShoppingBag, Building2, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const mockOrders = [
  {
    id: '1',
    orderNumber: 'PO-2024-001',
    vendor: 'Apple Inc.',
    status: 'CONFIRMED',
    orderDate: '2024-01-15',
    expectedDate: '2024-01-25',
    total: 125000.00,
  },
  {
    id: '2',
    orderNumber: 'PO-2024-002',
    vendor: 'Samsung Electronics',
    status: 'DRAFT',
    orderDate: '2024-01-18',
    expectedDate: '2024-02-01',
    total: 45000.00,
  },
  {
    id: '3',
    orderNumber: 'PO-2024-003',
    vendor: 'Dell Technologies',
    status: 'RECEIVED',
    orderDate: '2024-01-10',
    expectedDate: '2024-01-20',
    total: 78500.00,
  },
]

const statusConfig: Record<string, { color: 'default' | 'success' | 'warning' | 'danger', icon: React.ElementType }> = {
  DRAFT: { color: 'default', icon: Clock },
  SENT: { color: 'warning', icon: Clock },
  CONFIRMED: { color: 'success', icon: CheckCircle },
  RECEIVED: { color: 'success', icon: CheckCircle },
  CANCELLED: { color: 'danger', icon: XCircle },
}

export default function PurchasePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = mockOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage vendor orders and procurement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
              <ShoppingBag className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Received</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">14</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vendors</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Order Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Expected</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status]
                const StatusIcon = status.icon
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {order.vendor}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {order.orderDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {order.expectedDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
