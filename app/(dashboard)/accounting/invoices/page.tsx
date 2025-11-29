'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  Send,
  Printer,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CreditCard,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { StatCard } from '@/components/ui/stat-card'
import { ChartWrapper, LineChart, DoughnutChart } from '@/components/charts/charts'
import { formatCurrency, formatDate } from '@/lib/utils'

// Sample invoice data
const invoices = [
  {
    id: 'INV-2024-001',
    customer: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 15670.00,
    paidAmount: 15670.00,
    status: 'Paid',
    items: 5,
    orderRef: 'SO-2024-001',
  },
  {
    id: 'INV-2024-002',
    customer: 'TechStart Inc.',
    customerEmail: 'accounts@techstart.com',
    issueDate: '2024-01-14',
    dueDate: '2024-02-14',
    amount: 8450.00,
    paidAmount: 4225.00,
    status: 'Partial',
    items: 3,
    orderRef: 'SO-2024-002',
  },
  {
    id: 'INV-2024-003',
    customer: 'Global Industries',
    customerEmail: 'finance@global.com',
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
    amount: 23100.00,
    paidAmount: 0,
    status: 'Overdue',
    items: 8,
    orderRef: 'SO-2024-003',
  },
  {
    id: 'INV-2024-004',
    customer: 'Smart Solutions',
    customerEmail: 'billing@smart.io',
    issueDate: '2024-01-13',
    dueDate: '2024-02-13',
    amount: 6780.00,
    paidAmount: 0,
    status: 'Sent',
    items: 4,
    orderRef: 'SO-2024-004',
  },
  {
    id: 'INV-2024-005',
    customer: 'Prime Retail',
    customerEmail: 'accounts@prime.com',
    issueDate: '2024-01-12',
    dueDate: '2024-02-12',
    amount: 34500.00,
    paidAmount: 0,
    status: 'Draft',
    items: 12,
    orderRef: 'SO-2024-005',
  },
  {
    id: 'INV-2024-006',
    customer: 'NextGen Labs',
    customerEmail: 'finance@nextgen.com',
    issueDate: '2024-01-08',
    dueDate: '2024-01-22',
    amount: 12890.00,
    paidAmount: 12890.00,
    status: 'Paid',
    items: 6,
    orderRef: 'SO-2024-006',
  },
]

// Sample invoice line items
const invoiceItems = [
  { id: 1, product: 'MacBook Pro 16"', quantity: 2, unitPrice: 2499.00, subtotal: 4998.00 },
  { id: 2, product: 'iPhone 15 Pro', quantity: 5, unitPrice: 1099.00, subtotal: 5495.00 },
  { id: 3, product: 'AirPods Pro', quantity: 10, unitPrice: 249.00, subtotal: 2490.00 },
]

const statusColors: Record<string, 'success' | 'warning' | 'default' | 'secondary' | 'danger'> = {
  Paid: 'success',
  Partial: 'warning',
  Sent: 'default',
  Draft: 'secondary',
  Overdue: 'danger',
  Cancelled: 'danger',
}

const statusIcons: Record<string, React.ElementType> = {
  Paid: CheckCircle,
  Partial: Clock,
  Sent: Send,
  Draft: FileText,
  Overdue: AlertTriangle,
  Cancelled: XCircle,
}

const monthlyRevenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Invoiced',
      data: [45000, 52000, 48000, 61000, 55000, 67000],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      label: 'Collected',
      data: [42000, 48000, 45000, 58000, 52000, 64000],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
  ],
}

const invoiceStatusData = {
  labels: ['Paid', 'Partial', 'Sent', 'Overdue', 'Draft'],
  data: [12, 3, 8, 2, 5],
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

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalOutstanding = totalInvoiced - totalCollected
  const overdueAmount = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amount - inv.paidAmount, 0)

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
            Invoices
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track customer invoices
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Invoiced"
          value={formatCurrency(totalInvoiced)}
          icon={FileText}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Collected"
          value={formatCurrency(totalCollected)}
          icon={CheckCircle}
          trend={{ value: 8.2, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Outstanding"
          value={formatCurrency(totalOutstanding)}
          icon={Clock}
          trend={{ value: 5.1, isPositive: false }}
          color="yellow"
          delay={0.2}
        />
        <StatCard
          title="Overdue"
          value={formatCurrency(overdueAmount)}
          icon={AlertTriangle}
          trend={{ value: 2.3, isPositive: false }}
          color="red"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Revenue Trend"
          description="Invoiced vs Collected"
          delay={0.4}
        >
          <LineChart
            labels={monthlyRevenueData.labels}
            datasets={monthlyRevenueData.datasets}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Invoice Status"
          description="Distribution by status"
          delay={0.5}
        >
          <DoughnutChart
            labels={invoiceStatusData.labels}
            data={invoiceStatusData.data}
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
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="max-w-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Draft', 'Sent', 'Paid', 'Partial', 'Overdue'].map((status) => (
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
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invoices Table */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Invoice #
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Customer
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Issue Date
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Due Date
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      Amount
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      Paid
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
                    {filteredInvoices.map((invoice, index) => {
                      const StatusIcon = statusIcons[invoice.status]
                      return (
                        <motion.tr
                          key={invoice.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="py-4">
                            <p className="font-medium text-blue-600 dark:text-blue-400">
                              {invoice.id}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {invoice.orderRef}
                            </p>
                          </td>
                          <td className="py-4">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {invoice.customer}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.customerEmail}
                            </p>
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(invoice.issueDate)}
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(invoice.dueDate)}
                          </td>
                          <td className="py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(invoice.amount)}
                          </td>
                          <td className="py-4 text-right text-sm text-gray-600 dark:text-gray-300">
                            {formatCurrency(invoice.paidAmount)}
                          </td>
                          <td className="py-4">
                            <Badge variant={statusColors[invoice.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedInvoice(invoice)
                                  setShowDetailModal(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {invoice.status === 'Draft' && (
                                <Button variant="ghost" size="icon">
                                  <Send className="h-4 w-4 text-blue-500" />
                                </Button>
                              )}
                              {['Sent', 'Partial', 'Overdue'].includes(invoice.status) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedInvoice(invoice)
                                    setShowPaymentModal(true)
                                  }}
                                >
                                  <CreditCard className="h-4 w-4 text-green-500" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon">
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
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

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Invoice"
        description="Create a new invoice for your customer"
        size="xl"
      >
        <form className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer *
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select customer...</option>
                <option>Acme Corporation</option>
                <option>TechStart Inc.</option>
                <option>Global Industries</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sales Order (Optional)
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select order...</option>
                <option>SO-2024-001</option>
                <option>SO-2024-002</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issue Date *
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date *
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
                      Product/Service
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                      Unit Price
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
                      <Input placeholder="Description..." />
                    </td>
                    <td className="px-4 py-2">
                      <Input type="number" className="w-20 text-center" defaultValue="1" />
                    </td>
                    <td className="px-4 py-2">
                      <Input type="number" className="w-28 text-right" placeholder="0.00" />
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
                <span className="text-lg font-bold text-gray-900 dark:text-white">$0.00</span>
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
              placeholder="Payment terms, notes..."
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
              Create &amp; Send
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Invoice ${selectedInvoice?.id}`}
        size="xl"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedInvoice.customer}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{selectedInvoice.customerEmail}</p>
              </div>
              <Badge variant={statusColors[selectedInvoice.status]} className="text-sm">
                {selectedInvoice.status}
              </Badge>
            </div>

            {/* Invoice Info */}
            <div className="grid gap-4 md:grid-cols-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedInvoice.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedInvoice.issueDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedInvoice.dueDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Reference</p>
                <p className="font-medium text-blue-600 dark:text-blue-400">
                  {selectedInvoice.orderRef}
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
                        Description
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((lineItem) => (
                      <tr key={lineItem.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {lineItem.product}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">
                          {lineItem.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                          {formatCurrency(lineItem.unitPrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                          {formatCurrency(lineItem.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(selectedInvoice.amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Amount</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(selectedInvoice.amount)}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">Paid Amount</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(selectedInvoice.paidAmount)}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Balance Due</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                  {formatCurrency(selectedInvoice.amount - selectedInvoice.paidAmount)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {['Sent', 'Partial', 'Overdue'].includes(selectedInvoice.status) && (
                <Button variant="success" onClick={() => {
                  setShowDetailModal(false)
                  setShowPaymentModal(true)
                }}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
        description={`Record payment for ${selectedInvoice?.id}`}
      >
        {selectedInvoice && (
          <form className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">Invoice Total</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedInvoice.amount)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">Already Paid</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(selectedInvoice.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                <span className="font-medium text-gray-900 dark:text-white">Balance Due</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedInvoice.amount - selectedInvoice.paidAmount)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Amount *
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  defaultValue={(selectedInvoice.amount - selectedInvoice.paidAmount).toFixed(2)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Date *
                </label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                  <option>Bank Transfer</option>
                  <option>Credit Card</option>
                  <option>Cash</option>
                  <option>Check</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference
                </label>
                <Input placeholder="Transaction ID / Check #" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                rows={2}
                placeholder="Payment notes..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Receipt className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </motion.div>
  )
}
