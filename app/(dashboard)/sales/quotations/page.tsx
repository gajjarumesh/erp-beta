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
  Copy,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { StatCard } from '@/components/ui/stat-card'
import { formatCurrency, formatDate } from '@/lib/utils'

// Sample quotation data
const quotations = [
  {
    id: 'QT-2024-001',
    customer: 'Acme Corporation',
    customerEmail: 'contact@acme.com',
    date: '2024-01-15',
    validUntil: '2024-02-15',
    amount: 25670.00,
    status: 'Sent',
    items: 5,
    notes: 'Bulk order discount applied',
  },
  {
    id: 'QT-2024-002',
    customer: 'TechStart Inc.',
    customerEmail: 'orders@techstart.com',
    date: '2024-01-14',
    validUntil: '2024-02-14',
    amount: 12450.00,
    status: 'Draft',
    items: 3,
    notes: '',
  },
  {
    id: 'QT-2024-003',
    customer: 'Global Industries',
    customerEmail: 'procurement@global.com',
    date: '2024-01-13',
    validUntil: '2024-02-13',
    amount: 45100.00,
    status: 'Accepted',
    items: 12,
    notes: 'Converted to SO-2024-015',
  },
  {
    id: 'QT-2024-004',
    customer: 'Smart Solutions',
    customerEmail: 'hello@smart-solutions.io',
    date: '2024-01-12',
    validUntil: '2024-02-12',
    amount: 8560.00,
    status: 'Expired',
    items: 4,
    notes: 'Customer requested extension',
  },
  {
    id: 'QT-2024-005',
    customer: 'Prime Retail',
    customerEmail: 'buying@primeretail.com',
    date: '2024-01-11',
    validUntil: '2024-02-11',
    amount: 67890.00,
    status: 'Rejected',
    items: 8,
    notes: 'Price too high',
  },
  {
    id: 'QT-2024-006',
    customer: 'NextGen Labs',
    customerEmail: 'orders@nextgen.com',
    date: '2024-01-10',
    validUntil: '2024-02-10',
    amount: 34560.00,
    status: 'Sent',
    items: 6,
    notes: 'Awaiting customer feedback',
  },
]

// Sample line items for quotation
const quotationItems = [
  { id: 1, product: 'MacBook Pro 16"', sku: 'MBP-16-M3', quantity: 5, unitPrice: 2499.00, discount: 0, subtotal: 12495.00 },
  { id: 2, product: 'iPhone 15 Pro', sku: 'IP15-PRO-256', quantity: 10, unitPrice: 1099.00, discount: 5, subtotal: 10440.50 },
  { id: 3, product: 'AirPods Pro', sku: 'APP-2GEN', quantity: 15, unitPrice: 249.00, discount: 10, subtotal: 3361.50 },
]

const statusColors: Record<string, 'success' | 'warning' | 'default' | 'secondary' | 'danger'> = {
  Draft: 'secondary',
  Sent: 'warning',
  Accepted: 'success',
  Rejected: 'danger',
  Expired: 'default',
}

const statusIcons: Record<string, React.ElementType> = {
  Draft: FileText,
  Sent: Send,
  Accepted: CheckCircle,
  Rejected: XCircle,
  Expired: Clock,
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

export default function QuotationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<typeof quotations[0] | null>(null)

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || quotation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalQuotations = quotations.length
  const pendingQuotations = quotations.filter((q) => q.status === 'Sent' || q.status === 'Draft').length
  const acceptedValue = quotations
    .filter((q) => q.status === 'Accepted')
    .reduce((sum, q) => sum + q.amount, 0)
  const conversionRate = (quotations.filter((q) => q.status === 'Accepted').length / totalQuotations) * 100

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
            Quotations
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create and manage sales quotations for your customers
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Quotation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Quotations"
          value={totalQuotations.toString()}
          icon={FileText}
          trend={{ value: 8.5, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Pending Quotes"
          value={pendingQuotations.toString()}
          icon={Clock}
          trend={{ value: 3.2, isPositive: false }}
          color="yellow"
          delay={0.1}
        />
        <StatCard
          title="Accepted Value"
          value={formatCurrency(acceptedValue)}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
          color="green"
          delay={0.2}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend={{ value: 5.8, isPositive: true }}
          color="purple"
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
                  placeholder="Search quotations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="max-w-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quotations Table */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardHeader>
            <CardTitle>All Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Quotation #
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Customer
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Valid Until
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
                    {filteredQuotations.map((quotation, index) => {
                      const StatusIcon = statusIcons[quotation.status]
                      return (
                        <motion.tr
                          key={quotation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                            {quotation.id}
                          </td>
                          <td className="py-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {quotation.customer}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {quotation.customerEmail}
                            </p>
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(quotation.date)}
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(quotation.validUntil)}
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {quotation.items}
                          </td>
                          <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(quotation.amount)}
                          </td>
                          <td className="py-4">
                            <Badge variant={statusColors[quotation.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {quotation.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedQuotation(quotation)
                                  setShowDetailModal(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Copy className="h-4 w-4" />
                              </Button>
                              {quotation.status === 'Draft' && (
                                <Button variant="ghost" size="icon">
                                  <Send className="h-4 w-4 text-blue-500" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Quotation Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Quotation"
        description="Create a quotation to send to your customer"
        size="xl"
      >
        <form className="space-y-6">
          {/* Customer Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer *
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select a customer...</option>
                <option>Acme Corporation</option>
                <option>TechStart Inc.</option>
                <option>Global Industries</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valid Until *
              </label>
              <Input type="date" />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Line Items
              </label>
              <Button type="button" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Discount %
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                      Subtotal
                    </th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2">
                      <select className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800">
                        <option>Select product...</option>
                        <option>MacBook Pro 16 inch</option>
                        <option>iPhone 15 Pro</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <Input type="number" className="w-20" defaultValue="1" />
                    </td>
                    <td className="px-4 py-2">
                      <Input type="number" className="w-24" placeholder="0.00" />
                    </td>
                    <td className="px-4 py-2">
                      <Input type="number" className="w-20" defaultValue="0" />
                    </td>
                    <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                      $0.00
                    </td>
                    <td className="px-4 py-2">
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tax (10%)</span>
                <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="font-medium text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-gray-900 dark:text-white">$0.00</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes / Terms
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              rows={3}
              placeholder="Add any notes or terms and conditions..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Send Quotation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quotation Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Quotation ${selectedQuotation?.id}`}
        size="xl"
      >
        {selectedQuotation && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedQuotation.customer}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{selectedQuotation.customerEmail}</p>
              </div>
              <Badge variant={statusColors[selectedQuotation.status]} className="text-sm">
                {selectedQuotation.status}
              </Badge>
            </div>

            {/* Quotation Info */}
            <div className="grid gap-4 md:grid-cols-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quotation Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedQuotation.date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Valid Until</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedQuotation.validUntil)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedQuotation.items}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatCurrency(selectedQuotation.amount)}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Line Items</h4>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        Discount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotationItems.map((lineItem) => (
                      <tr key={lineItem.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {lineItem.product}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {lineItem.sku}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">
                          {lineItem.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                          {formatCurrency(lineItem.unitPrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-500 dark:text-gray-400">
                          {lineItem.discount}%
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                          {formatCurrency(lineItem.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(selectedQuotation.amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            {selectedQuotation.notes && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  {selectedQuotation.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {selectedQuotation.status === 'Sent' && (
                <Button variant="success">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Convert to Order
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
