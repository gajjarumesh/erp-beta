'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Warehouse,
  MapPin,
  Package,
  Users,
  ArrowRightLeft,
  BarChart3,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { StatCard } from '@/components/ui/stat-card'
import { ChartWrapper, BarChart, DoughnutChart } from '@/components/charts/charts'
import { formatCurrency } from '@/lib/utils'

// Sample warehouse data
const warehouses = [
  {
    id: 'WH-001',
    name: 'Main Warehouse',
    code: 'WH-MAIN',
    address: '100 Warehouse Road, San Francisco, CA 94102',
    manager: 'John Smith',
    products: 156,
    totalStock: 4560,
    stockValue: 1250000,
    utilization: 78,
    isActive: true,
  },
  {
    id: 'WH-002',
    name: 'East Coast Distribution',
    code: 'WH-EAST',
    address: '200 Distribution Ave, New York, NY 10001',
    manager: 'Sarah Johnson',
    products: 89,
    totalStock: 2340,
    stockValue: 780000,
    utilization: 65,
    isActive: true,
  },
  {
    id: 'WH-003',
    name: 'Secondary Storage',
    code: 'WH-SEC',
    address: '50 Storage Lane, Austin, TX 78701',
    manager: 'Mike Brown',
    products: 45,
    totalStock: 890,
    stockValue: 250000,
    utilization: 42,
    isActive: true,
  },
  {
    id: 'WH-004',
    name: 'Returns Center',
    code: 'WH-RET',
    address: '75 Returns Blvd, Chicago, IL 60601',
    manager: 'Lisa Chen',
    products: 23,
    totalStock: 450,
    stockValue: 120000,
    utilization: 30,
    isActive: false,
  },
]

const stockByWarehouseData = {
  labels: warehouses.map((w) => w.name.split(' ')[0]),
  datasets: [
    {
      label: 'Stock Units',
      data: warehouses.map((w) => w.totalStock),
    },
  ],
}

const utilizationData = {
  labels: warehouses.filter((w) => w.isActive).map((w) => w.name.split(' ')[0]),
  data: warehouses.filter((w) => w.isActive).map((w) => w.utilization),
}

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

export default function WarehousesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalWarehouses = warehouses.length
  const activeWarehouses = warehouses.filter((w) => w.isActive).length
  const totalStockValue = warehouses.reduce((sum, w) => sum + w.stockValue, 0)
  const avgUtilization = warehouses.filter((w) => w.isActive).reduce((sum, w) => sum + w.utilization, 0) / activeWarehouses

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
            Warehouses
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your warehouses and storage locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTransferModal(true)}>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Stock Transfer
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Warehouses"
          value={totalWarehouses.toString()}
          icon={Warehouse}
          trend={{ value: 1, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Active Warehouses"
          value={activeWarehouses.toString()}
          icon={CheckCircle}
          trend={{ value: 0, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Total Stock Value"
          value={formatCurrency(totalStockValue)}
          icon={BarChart3}
          trend={{ value: 8.5, isPositive: true }}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Avg. Utilization"
          value={`${avgUtilization.toFixed(0)}%`}
          icon={Package}
          trend={{ value: 5.2, isPositive: true }}
          color="yellow"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Stock by Warehouse"
          description="Distribution of stock across warehouses"
          delay={0.4}
        >
          <BarChart
            labels={stockByWarehouseData.labels}
            datasets={stockByWarehouseData.datasets}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Utilization Rate"
          description="Warehouse capacity utilization"
          delay={0.5}
        >
          <DoughnutChart
            labels={utilizationData.labels}
            data={utilizationData.data}
            height={250}
          />
        </ChartWrapper>
      </div>

      {/* Search */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardContent className="p-4">
            <Input
              placeholder="Search warehouses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              className="max-w-sm"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Warehouses Grid */}
      <motion.div variants={container} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredWarehouses.map((warehouse) => (
            <motion.div key={warehouse.id} variants={item}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${warehouse.isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <Warehouse className={`h-6 w-6 ${warehouse.isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {warehouse.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {warehouse.code}
                        </p>
                      </div>
                    </div>
                    <Badge variant={warehouse.isActive ? 'success' : 'secondary'}>
                      {warehouse.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{warehouse.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>Manager: {warehouse.manager}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Products</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {warehouse.products}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total Stock</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {warehouse.totalStock.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Stock Value</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(warehouse.stockValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Utilization</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                warehouse.utilization > 80 ? 'bg-red-500' :
                                warehouse.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${warehouse.utilization}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {warehouse.utilization}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Package className="h-4 w-4 mr-1" />
                      View Stock
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Warehouse Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Warehouse"
        description="Enter warehouse details"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Warehouse Name *
              </label>
              <Input placeholder="e.g., Main Warehouse" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Warehouse Code *
              </label>
              <Input placeholder="e.g., WH-MAIN" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address *
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
                Manager
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select manager...</option>
                <option>John Smith</option>
                <option>Sarah Johnson</option>
                <option>Mike Brown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacity (units)
              </label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" className="rounded" defaultChecked />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
              Active warehouse
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Warehouse</Button>
          </div>
        </form>
      </Modal>

      {/* Stock Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Stock Transfer"
        description="Transfer stock between warehouses"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Warehouse *
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select source...</option>
                {warehouses.filter((w) => w.isActive).map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Warehouse *
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select destination...</option>
                {warehouses.filter((w) => w.isActive).map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product *
            </label>
            <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
              <option>Select product...</option>
              <option>MacBook Pro 16&quot;</option>
              <option>iPhone 15 Pro</option>
              <option>iPad Air</option>
              <option>AirPods Pro</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity *
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reference
              </label>
              <Input placeholder="e.g., TR-2024-001" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              rows={2}
              placeholder="Transfer notes..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowTransferModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Transfer Stock
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
