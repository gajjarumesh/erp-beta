'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Download,
  Package,
  Warehouse,
  AlertTriangle,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { Modal } from '@/components/ui/modal'
import { ChartWrapper, BarChart, DoughnutChart, PieChart } from '@/components/charts/charts'
import { formatCurrency, formatNumber } from '@/lib/utils'

// Sample data
const products = [
  {
    id: 'PRD-001',
    name: 'MacBook Pro 16"',
    sku: 'MBP-16-M3',
    category: 'Electronics',
    price: 2499.00,
    quantity: 45,
    minQuantity: 10,
    status: 'In Stock',
  },
  {
    id: 'PRD-002',
    name: 'iPhone 15 Pro',
    sku: 'IP15-PRO-256',
    category: 'Electronics',
    price: 1099.00,
    quantity: 8,
    minQuantity: 20,
    status: 'Low Stock',
  },
  {
    id: 'PRD-003',
    name: 'iPad Air',
    sku: 'IPA-5-64',
    category: 'Electronics',
    price: 599.00,
    quantity: 120,
    minQuantity: 25,
    status: 'In Stock',
  },
  {
    id: 'PRD-004',
    name: 'AirPods Pro',
    sku: 'APP-2GEN',
    category: 'Accessories',
    price: 249.00,
    quantity: 0,
    minQuantity: 50,
    status: 'Out of Stock',
  },
  {
    id: 'PRD-005',
    name: 'Apple Watch Ultra',
    sku: 'AWU-2-49',
    category: 'Wearables',
    price: 799.00,
    quantity: 67,
    minQuantity: 15,
    status: 'In Stock',
  },
  {
    id: 'PRD-006',
    name: 'Magic Keyboard',
    sku: 'MK-BT-US',
    category: 'Accessories',
    price: 99.00,
    quantity: 234,
    minQuantity: 30,
    status: 'In Stock',
  },
]

const stockByCategory = {
  labels: ['Electronics', 'Accessories', 'Wearables', 'Software', 'Services'],
  data: [45, 28, 15, 8, 4],
}

const stockMovement = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Stock In',
      data: [450, 520, 380, 620, 480, 550],
      backgroundColor: '#10B981',
    },
    {
      label: 'Stock Out',
      data: [320, 410, 350, 480, 520, 430],
      backgroundColor: '#EF4444',
    },
  ],
}

const warehouseStock = {
  labels: ['Warehouse A', 'Warehouse B', 'Warehouse C'],
  data: [5420, 3850, 2130],
}

const statusColors: Record<string, 'success' | 'warning' | 'danger'> = {
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'danger',
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

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewProductModal, setShowNewProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length
  const outOfStockCount = products.filter((p) => p.status === 'Out of Stock').length

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
            Inventory
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your products and stock levels
          </p>
        </div>
        <Button onClick={() => setShowNewProductModal(true)}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={formatNumber(products.length)}
          icon={Package}
          trend={{ value: 5.2, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          icon={Warehouse}
          trend={{ value: 12.8, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Low Stock Items"
          value={formatNumber(lowStockCount)}
          icon={AlertTriangle}
          trend={{ value: 2.1, isPositive: false }}
          color="yellow"
          delay={0.2}
        />
        <StatCard
          title="Out of Stock"
          value={formatNumber(outOfStockCount)}
          icon={TrendingDown}
          trend={{ value: 1.5, isPositive: false }}
          color="red"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWrapper
          title="Stock by Category"
          description="Distribution across categories"
          delay={0.4}
        >
          <DoughnutChart
            labels={stockByCategory.labels}
            data={stockByCategory.data}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Stock Movement"
          description="Monthly in/out movement"
          delay={0.5}
          className="lg:col-span-2"
        >
          <BarChart
            labels={stockMovement.labels}
            datasets={stockMovement.datasets}
            height={250}
          />
        </ChartWrapper>
      </div>

      {/* Products Table */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Products</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Search products..."
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
                      Product
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      SKU
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Category
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Price
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Quantity
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
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                              <Package className="h-5 w-5 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {product.sku}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {product.category}
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {product.quantity}
                            </span>
                            {product.quantity < product.minQuantity && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant={statusColors[product.status]}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedProduct(product)}
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

      {/* Warehouse Distribution */}
      <motion.div variants={item}>
        <ChartWrapper
          title="Warehouse Distribution"
          description="Stock levels across warehouses"
          delay={0.6}
        >
          <PieChart
            labels={warehouseStock.labels}
            data={warehouseStock.data}
            height={300}
          />
        </ChartWrapper>
      </motion.div>

      {/* New Product Modal */}
      <Modal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        title="Add New Product"
        description="Fill in the details to add a new product"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <Input placeholder="Enter product name..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU
              </label>
              <Input placeholder="Enter SKU..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <Input placeholder="Select category..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min. Quantity
              </label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              rows={3}
              placeholder="Add product description..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowNewProductModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </Modal>

      {/* Product Details Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || ''}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">SKU</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedProduct.sku}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedProduct.category}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedProduct.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedProduct.quantity} / Min: {selectedProduct.minQuantity}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant={statusColors[selectedProduct.status]}>
                  {selectedProduct.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedProduct.price * selectedProduct.quantity)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
