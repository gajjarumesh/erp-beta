'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Download,
  Receipt,
  DollarSign,
  CreditCard,
  TrendingUp,
  Eye,
  Edit,
  Send,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { Modal } from '@/components/ui/modal'
import { ChartWrapper, LineChart, BarChart, DoughnutChart } from '@/components/charts/charts'
import { formatCurrency, formatDate } from '@/lib/utils'

// Sample data
const invoices = [
  {
    id: 'INV-2024-001',
    customer: 'Acme Corporation',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 15670.00,
    paidAmount: 15670.00,
    status: 'Paid',
  },
  {
    id: 'INV-2024-002',
    customer: 'TechStart Inc.',
    issueDate: '2024-01-14',
    dueDate: '2024-02-14',
    amount: 8450.00,
    paidAmount: 4000.00,
    status: 'Partial',
  },
  {
    id: 'INV-2024-003',
    customer: 'Global Industries',
    issueDate: '2024-01-13',
    dueDate: '2024-01-28',
    amount: 23100.00,
    paidAmount: 0,
    status: 'Overdue',
  },
  {
    id: 'INV-2024-004',
    customer: 'Smart Solutions',
    issueDate: '2024-01-12',
    dueDate: '2024-02-12',
    amount: 6780.00,
    paidAmount: 0,
    status: 'Sent',
  },
  {
    id: 'INV-2024-005',
    customer: 'Prime Retail',
    issueDate: '2024-01-11',
    dueDate: '2024-02-11',
    amount: 34500.00,
    paidAmount: 0,
    status: 'Draft',
  },
]

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 69000, 78000, 82000, 75000, 91000],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Expenses',
      data: [32000, 38000, 35000, 42000, 38000, 45000, 48000, 46000, 52000, 55000, 50000, 58000],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
  ],
}

const paymentMethods = {
  labels: ['Bank Transfer', 'Credit Card', 'Cash', 'Check', 'Other'],
  data: [45, 30, 15, 7, 3],
}

const monthlyPayments = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Received',
      data: [28000, 35000, 31000, 42000],
      backgroundColor: '#10B981',
    },
    {
      label: 'Pending',
      data: [12000, 8000, 15000, 9000],
      backgroundColor: '#F59E0B',
    },
  ],
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'default' | 'secondary'> = {
  Paid: 'success',
  Partial: 'warning',
  Overdue: 'danger',
  Sent: 'default',
  Draft: 'secondary',
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

export default function AccountingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalReceived = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalPending = totalRevenue - totalReceived
  const overdueCount = invoices.filter((inv) => inv.status === 'Overdue').length

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
            Accounting
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage invoices, payments, and financial reports
          </p>
        </div>
        <Button onClick={() => setShowNewInvoiceModal(true)}>
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 18.5, isPositive: true }}
          color="green"
          delay={0}
        />
        <StatCard
          title="Received"
          value={formatCurrency(totalReceived)}
          icon={CreditCard}
          trend={{ value: 12.3, isPositive: true }}
          color="blue"
          delay={0.1}
        />
        <StatCard
          title="Pending"
          value={formatCurrency(totalPending)}
          icon={Receipt}
          trend={{ value: 5.2, isPositive: false }}
          color="yellow"
          delay={0.2}
        />
        <StatCard
          title="Overdue Invoices"
          value={overdueCount.toString()}
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: false }}
          color="red"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWrapper
          title="Revenue vs Expenses"
          description="Monthly comparison"
          delay={0.4}
          className="lg:col-span-2"
        >
          <LineChart
            labels={revenueData.labels}
            datasets={revenueData.datasets}
            height={300}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Payment Methods"
          description="Distribution by method"
          delay={0.5}
        >
          <DoughnutChart
            labels={paymentMethods.labels}
            data={paymentMethods.data}
            height={300}
          />
        </ChartWrapper>
      </div>

      {/* Invoices Table */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Invoices</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Search invoices..."
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
                      Invoice
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
                    {filteredInvoices.map((invoice, index) => (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                          {invoice.id}
                        </td>
                        <td className="py-4 text-sm text-gray-900 dark:text-white">
                          {invoice.customer}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(invoice.issueDate)}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(invoice.amount)}
                            </p>
                            {invoice.paidAmount > 0 && invoice.paidAmount < invoice.amount && (
                              <p className="text-xs text-gray-500">
                                Paid: {formatCurrency(invoice.paidAmount)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant={statusColors[invoice.status]}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {invoice.status === 'Draft' && (
                              <Button variant="ghost" size="icon">
                                <Send className="h-4 w-4 text-blue-500" />
                              </Button>
                            )}
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

      {/* Payment Trends */}
      <motion.div variants={item}>
        <ChartWrapper
          title="Weekly Payment Trends"
          description="Received vs pending payments"
          delay={0.6}
        >
          <BarChart
            labels={monthlyPayments.labels}
            datasets={monthlyPayments.datasets}
            height={250}
          />
        </ChartWrapper>
      </motion.div>

      {/* New Invoice Modal */}
      <Modal
        isOpen={showNewInvoiceModal}
        onClose={() => setShowNewInvoiceModal(false)}
        title="Create New Invoice"
        description="Fill in the details to create a new invoice"
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
                Issue Date
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
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
              placeholder="Add any notes..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowNewInvoiceModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Invoice</Button>
          </div>
        </form>
      </Modal>

      {/* Invoice Details Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Invoice ${selectedInvoice?.id}`}
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedInvoice.customer}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant={statusColors[selectedInvoice.status]}>
                  {selectedInvoice.status}
                </Badge>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedInvoice.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paid Amount</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedInvoice.paidAmount)}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Balance Due</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(selectedInvoice.amount - selectedInvoice.paidAmount)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
