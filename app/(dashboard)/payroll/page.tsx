'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, DollarSign, Users, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const mockPayslips = [
  {
    id: '1',
    employee: 'John Smith',
    department: 'Engineering',
    period: 'January 2024',
    status: 'PAID',
    grossPay: 7916.67,
    netPay: 5875.00,
  },
  {
    id: '2',
    employee: 'Sarah Johnson',
    department: 'Marketing',
    period: 'January 2024',
    status: 'PAID',
    grossPay: 7083.33,
    netPay: 5350.00,
  },
  {
    id: '3',
    employee: 'Michael Brown',
    department: 'Sales',
    period: 'January 2024',
    status: 'CONFIRMED',
    grossPay: 4583.33,
    netPay: 3650.00,
  },
  {
    id: '4',
    employee: 'Emily Davis',
    department: 'HR',
    period: 'January 2024',
    status: 'DRAFT',
    grossPay: 5416.67,
    netPay: 4100.00,
  },
]

const statusConfig: Record<string, { color: 'default' | 'success' | 'warning' }> = {
  DRAFT: { color: 'default' },
  CONFIRMED: { color: 'warning' },
  PAID: { color: 'success' },
}

export default function PayrollPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPayslips = mockPayslips.filter(payslip =>
    payslip.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payslip.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage salaries and payslips</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Payroll</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">$125,000</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Employees</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Payslips</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Period</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">Jan 2024</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search employees..."
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
            Generate Payslips
          </Button>
        </div>
      </div>

      {/* Payslips Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Period</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Gross Pay</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Net Pay</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayslips.map((payslip) => (
                <tr key={payslip.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {payslip.employee}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {payslip.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {payslip.period}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[payslip.status].color}>
                      {payslip.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                    ${payslip.grossPay.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                    ${payslip.netPay.toFixed(2)}
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
