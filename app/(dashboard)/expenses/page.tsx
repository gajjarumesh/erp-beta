'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Wallet, CheckCircle, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const mockExpenses = [
  {
    id: '1',
    description: 'Office Supplies',
    category: 'Office',
    employee: 'John Smith',
    status: 'APPROVED',
    date: '2024-01-15',
    amount: 245.50,
  },
  {
    id: '2',
    description: 'Client Dinner',
    category: 'Meals',
    employee: 'Sarah Johnson',
    status: 'SUBMITTED',
    date: '2024-01-18',
    amount: 189.00,
  },
  {
    id: '3',
    description: 'Conference Registration',
    category: 'Events',
    employee: 'Michael Brown',
    status: 'REIMBURSED',
    date: '2024-01-10',
    amount: 599.00,
  },
  {
    id: '4',
    description: 'Travel - NYC Trip',
    category: 'Travel',
    employee: 'John Smith',
    status: 'DRAFT',
    date: '2024-01-20',
    amount: 1250.00,
  },
]

const statusConfig: Record<string, { color: 'default' | 'success' | 'warning' | 'danger' }> = {
  DRAFT: { color: 'default' },
  SUBMITTED: { color: 'warning' },
  APPROVED: { color: 'success' },
  REIMBURSED: { color: 'success' },
  REJECTED: { color: 'danger' },
}

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredExpenses = mockExpenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.employee.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Track and manage expense reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
              <Wallet className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">$12,450</p>
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
              <p className="text-xl font-bold text-gray-900 dark:text-white">$2,350</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">$8,600</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reimbursed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">$6,890</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search expenses..."
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
            New Expense
          </Button>
        </div>
      </div>

      {/* Expenses Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {expense.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {expense.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {expense.employee}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[expense.status].color}>
                      {expense.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {expense.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
