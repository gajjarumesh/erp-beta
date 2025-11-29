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
  Package,
  BarChart3,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Box,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { StatCard } from '@/components/ui/stat-card'
import { ChartWrapper, BarChart, DoughnutChart } from '@/components/charts/charts'
import { formatCurrency } from '@/lib/utils'

// Sample product data
const products = [
  {
    id: 'PROD-001',
    name: 'MacBook Pro 16"',
    sku: 'MBP-16-M3',
    category: 'Electronics',
    price: 2499.00,
    cost: 2000.00,
    quantity: 45,
    minQuantity: 10,
    warehouse: 'Main Warehouse',
    status: 'In Stock',
    image: '💻',
  },
  {
    id: 'PROD-002',
    name: 'iPhone 15 Pro',
    sku: 'IP15-PRO-256',
    category: 'Electronics',
    price: 1099.00,
    cost: 850.00,
    quantity: 120,
    minQuantity: 20,
    warehouse: 'Main Warehouse',
    status: 'In Stock',
    image: '📱',
  },
  {
    id: 'PROD-003',
    name: 'iPad Air',
    sku: 'IPA-5-64',
    category: 'Electronics',
    price: 599.00,
    cost: 450.00,
    quantity: 8,
    minQuantity: 25,
    warehouse: 'Main Warehouse',
    status: 'Low Stock',
    image: '📲',
  },
  {
    id: 'PROD-004',
    name: 'AirPods Pro',
    sku: 'APP-2GEN',
    category: 'Accessories',
    price: 249.00,
    cost: 180.00,
    quantity: 200,
    minQuantity: 50,
    warehouse: 'Secondary',
    status: 'In Stock',
    image: '🎧',
  },
  {
    id: 'PROD-005',
    name: 'Apple Watch Ultra',
    sku: 'AWU-2-49',
    category: 'Wearables',
    price: 799.00,
    cost: 600.00,
    quantity: 0,
    minQuantity: 15,
    warehouse: 'Main Warehouse',
    status: 'Out of Stock',
    image: '⌚',
  },
  {
    id: 'PROD-006',
    name: 'Magic Keyboard',
    sku: 'MK-2023',
    category: 'Accessories',
    price: 299.00,
    cost: 200.00,
    quantity: 67,
    minQuantity: 20,
    warehouse: 'Secondary',
    status: 'In Stock',
    image: '⌨️',
  },
]

const categories = ['All', 'Electronics', 'Accessories', 'Wearables', 'Software']

const stockData = {
  labels: ['Electronics', 'Accessories', 'Wearables', 'Software'],
  data: [173, 267, 67, 45],
}

const stockMovementData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'In', data: [120, 150, 180, 165, 200, 220], backgroundColor: '#10B981' },
    { label: 'Out', data: [90, 120, 140, 160, 180, 190], backgroundColor: '#EF4444' },
  ],
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
    transition: { staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const lowStockCount = products.filter((p) => p.quantity <= p.minQuantity && p.quantity > 0).length
  const outOfStockCount = products.filter((p) => p.quantity === 0).length

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
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={Package}
          trend={{ value: 5.2, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          icon={BarChart3}
          trend={{ value: 12.5, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount.toString()}
          icon={AlertTriangle}
          trend={{ value: 2, isPositive: false }}
          color="yellow"
          delay={0.2}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount.toString()}
          icon={Box}
          trend={{ value: 1, isPositive: false }}
          color="red"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Stock by Category"
          description="Distribution of products by category"
          delay={0.4}
        >
          <DoughnutChart
            labels={stockData.labels}
            data={stockData.data}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Stock Movement"
          description="Monthly stock in/out"
          delay={0.5}
        >
          <BarChart
            labels={stockMovementData.labels}
            datasets={stockMovementData.datasets}
            height={250}
          />
        </ChartWrapper>
      </div>

      {/* Filters */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-4 flex-wrap">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="max-w-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
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
                  <Layers className="h-4 w-4" />
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

      {/* Products Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl">{product.image}</div>
                      <Badge variant={statusColors[product.status]}>
                        {product.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {product.sku}
                    </p>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-500 dark:text-gray-400">Price</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-500 dark:text-gray-400">Stock</span>
                      <span className={`font-semibold ${product.quantity <= product.minQuantity ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                        {product.quantity} units
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowDetailModal(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowAdjustModal(true)
                        }}
                      >
                        <ArrowUp className="h-4 w-4" />
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
              <CardHeader>
                <CardTitle>All Products</CardTitle>
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
                        <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                          Price
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                          Cost
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                          Stock
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
                                <span className="text-2xl">{product.image}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                              {product.sku}
                            </td>
                            <td className="py-4">
                              <Badge variant="secondary">{product.category}</Badge>
                            </td>
                            <td className="py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="py-4 text-right text-sm text-gray-600 dark:text-gray-300">
                              {formatCurrency(product.cost)}
                            </td>
                            <td className="py-4 text-right">
                              <span className={`text-sm font-medium ${product.quantity <= product.minQuantity ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                {product.quantity}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                / min: {product.minQuantity}
                              </span>
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
                                  onClick={() => {
                                    setSelectedProduct(product)
                                    setShowDetailModal(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedProduct(product)
                                    setShowAdjustModal(true)
                                  }}
                                >
                                  <ArrowUp className="h-4 w-4 text-green-500" />
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
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        description="Enter product details to add to your catalog"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name *
              </label>
              <Input placeholder="Enter product name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU *
              </label>
              <Input placeholder="e.g., PROD-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select category...</option>
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Wearables</option>
                <option>Software</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Selling Price *
              </label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cost Price
              </label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Initial Stock
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min. Stock Level
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Unit</option>
                <option>Piece</option>
                <option>Box</option>
                <option>Kg</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Warehouse
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Main Warehouse</option>
                <option>Secondary</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              rows={3}
              placeholder="Product description..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </Modal>

      {/* Product Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedProduct?.name || 'Product Details'}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="text-6xl">{selectedProduct.image}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedProduct.name}
                  </h3>
                  <Badge variant={statusColors[selectedProduct.status]}>
                    {selectedProduct.status}
                  </Badge>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">{selectedProduct.sku}</p>
                <Badge variant="secondary">{selectedProduct.category}</Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Selling Price</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedProduct.price)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Cost Price</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedProduct.cost)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Margin</p>
                <p className="text-xl font-bold text-green-600">
                  {(((selectedProduct.price - selectedProduct.cost) / selectedProduct.price) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Stock Value</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedProduct.price * selectedProduct.quantity)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Stock Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Current Stock</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedProduct.quantity} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Min. Stock Level</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedProduct.minQuantity} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Warehouse</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedProduct.warehouse}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Movements</h4>
                <div className="space-y-2">
                  {[
                    { type: 'In', qty: 50, date: '2024-01-15' },
                    { type: 'Out', qty: 12, date: '2024-01-14' },
                    { type: 'Out', qty: 8, date: '2024-01-12' },
                  ].map((move, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {move.type === 'In' ? (
                          <ArrowDown className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-gray-500 dark:text-gray-400">{move.date}</span>
                      </div>
                      <span className={`font-medium ${move.type === 'In' ? 'text-green-600' : 'text-red-600'}`}>
                        {move.type === 'In' ? '+' : '-'}{move.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="outline" onClick={() => {
                setShowDetailModal(false)
                setShowAdjustModal(true)
              }}>
                <ArrowUp className="h-4 w-4 mr-2" />
                Adjust Stock
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        title="Adjust Stock"
        description={`Adjust stock for ${selectedProduct?.name}`}
      >
        {selectedProduct && (
          <form className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Current Stock</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedProduct.quantity} units
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adjustment Type
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option value="add">Add Stock (Receipt)</option>
                <option value="remove">Remove Stock</option>
                <option value="set">Set to Specific Value</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <Input type="number" placeholder="Enter quantity" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reference
              </label>
              <Input placeholder="e.g., PO-2024-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                rows={2}
                placeholder="Reason for adjustment..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAdjustModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Apply Adjustment</Button>
            </div>
          </form>
        )}
      </Modal>
    </motion.div>
  )
}
