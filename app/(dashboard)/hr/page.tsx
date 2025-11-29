'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  Clock,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { Modal } from '@/components/ui/modal'
import { ChartWrapper, BarChart, DoughnutChart, LineChart } from '@/components/charts/charts'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'

// Sample data
const employees = [
  {
    id: 'EMP-001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 234 567 8901',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'Active',
    hireDate: '2022-03-15',
    salary: 95000,
  },
  {
    id: 'EMP-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 234 567 8902',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'Active',
    hireDate: '2021-08-20',
    salary: 85000,
  },
  {
    id: 'EMP-003',
    name: 'Michael Brown',
    email: 'm.brown@company.com',
    phone: '+1 234 567 8903',
    department: 'Sales',
    position: 'Sales Representative',
    status: 'On Leave',
    hireDate: '2023-01-10',
    salary: 55000,
  },
  {
    id: 'EMP-004',
    name: 'Emily Davis',
    email: 'e.davis@company.com',
    phone: '+1 234 567 8904',
    department: 'HR',
    position: 'HR Specialist',
    status: 'Active',
    hireDate: '2020-11-05',
    salary: 65000,
  },
  {
    id: 'EMP-005',
    name: 'David Wilson',
    email: 'd.wilson@company.com',
    phone: '+1 234 567 8905',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'Active',
    hireDate: '2022-06-01',
    salary: 75000,
  },
]

const leaveRequests = [
  { id: 1, employee: 'John Smith', type: 'Annual', startDate: '2024-02-01', endDate: '2024-02-05', status: 'Approved' },
  { id: 2, employee: 'Sarah Johnson', type: 'Sick', startDate: '2024-01-28', endDate: '2024-01-29', status: 'Approved' },
  { id: 3, employee: 'Michael Brown', type: 'Personal', startDate: '2024-02-10', endDate: '2024-02-12', status: 'Pending' },
  { id: 4, employee: 'Emily Davis', type: 'Annual', startDate: '2024-03-01', endDate: '2024-03-10', status: 'Pending' },
]

const departmentData = {
  labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'],
  data: [25, 12, 18, 8, 10, 15],
}

const attendanceData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Present',
      data: [85, 88, 82, 90, 78],
      backgroundColor: '#10B981',
    },
    {
      label: 'Absent',
      data: [3, 2, 5, 2, 8],
      backgroundColor: '#EF4444',
    },
    {
      label: 'On Leave',
      data: [2, 0, 3, 1, 4],
      backgroundColor: '#F59E0B',
    },
  ],
}

const performanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Average Performance',
      data: [72, 75, 78, 82, 80, 85],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
  ],
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  Active: 'success',
  'On Leave': 'warning',
  Inactive: 'danger',
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'danger',
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

export default function HRPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'leaves'>('employees')

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = employees.filter((e) => e.status === 'Active').length
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length

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
            Human Resources
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage employees, attendance, and leave requests
          </p>
        </div>
        <Button onClick={() => setShowNewEmployeeModal(true)}>
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={employees.length.toString()}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Active"
          value={activeCount.toString()}
          icon={UserCheck}
          trend={{ value: 3.1, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="On Leave"
          value={onLeaveCount.toString()}
          icon={Calendar}
          trend={{ value: 1.2, isPositive: false }}
          color="yellow"
          delay={0.2}
        />
        <StatCard
          title="Avg. Attendance"
          value="94%"
          icon={Clock}
          trend={{ value: 2.5, isPositive: true }}
          color="purple"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWrapper
          title="Employees by Department"
          description="Distribution across departments"
          delay={0.4}
        >
          <DoughnutChart
            labels={departmentData.labels}
            data={departmentData.data}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Weekly Attendance"
          description="This week's attendance"
          delay={0.5}
          className="lg:col-span-2"
        >
          <BarChart
            labels={attendanceData.labels}
            datasets={attendanceData.datasets}
            height={250}
          />
        </ChartWrapper>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['employees', 'attendance', 'leaves'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              />
            )}
          </button>
        ))}
      </div>

      {/* Employees Table */}
      {activeTab === 'employees' && (
        <motion.div variants={item}>
          <Card hover={false}>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Employees</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Search employees..."
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
                        Employee
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Department
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Position
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Hire Date
                      </th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredEmployees.map((employee, index) => (
                        <motion.tr
                          key={employee.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                                {getInitials(employee.name)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {employee.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {employee.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {employee.department}
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {employee.position}
                          </td>
                          <td className="py-4">
                            <Badge variant={statusColors[employee.status]}>
                              {employee.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(employee.hireDate)}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedEmployee(employee)}
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
      )}

      {/* Leave Requests */}
      {activeTab === 'leaves' && (
        <motion.div variants={item}>
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Employee
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Type
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Start Date
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        End Date
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
                    {leaveRequests.map((leave, index) => (
                      <motion.tr
                        key={leave.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                      >
                        <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {leave.employee}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {leave.type}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(leave.startDate)}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(leave.endDate)}
                        </td>
                        <td className="py-4">
                          <Badge variant={statusColors[leave.status]}>
                            {leave.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          {leave.status === 'Pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="success" size="sm">
                                Approve
                              </Button>
                              <Button variant="destructive" size="sm">
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Attendance */}
      {activeTab === 'attendance' && (
        <motion.div variants={item} className="space-y-6">
          <ChartWrapper
            title="Performance Trend"
            description="Average team performance over time"
            delay={0.6}
          >
            <LineChart
              labels={performanceData.labels}
              datasets={performanceData.datasets}
              height={300}
            />
          </ChartWrapper>
        </motion.div>
      )}

      {/* New Employee Modal */}
      <Modal
        isOpen={showNewEmployeeModal}
        onClose={() => setShowNewEmployeeModal(false)}
        title="Add New Employee"
        description="Fill in the details to add a new employee"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <Input placeholder="Enter full name..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input type="email" placeholder="Enter email..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <Input type="tel" placeholder="Enter phone..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <Input placeholder="Select department..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <Input placeholder="Enter position..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hire Date
              </label>
              <Input type="date" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowNewEmployeeModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </Modal>

      {/* Employee Details Modal */}
      <Modal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title={selectedEmployee?.name || ''}
        size="lg"
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-medium">
                {getInitials(selectedEmployee.name)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEmployee.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedEmployee.position}
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedEmployee.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedEmployee.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedEmployee.department}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant={statusColors[selectedEmployee.status]}>
                  {selectedEmployee.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hire Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedEmployee.hireDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedEmployee.salary)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
