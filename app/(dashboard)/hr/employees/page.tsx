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
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { StatCard } from '@/components/ui/stat-card'
import { ChartWrapper, BarChart, DoughnutChart } from '@/components/charts/charts'
import { formatCurrency, formatDate } from '@/lib/utils'

// Sample employee data
const employees = [
  {
    id: 'EMP-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acme.com',
    phone: '+1 234 567 8901',
    department: 'Engineering',
    jobTitle: 'Senior Developer',
    hireDate: '2022-03-15',
    salary: 95000,
    status: 'Active',
    avatar: 'JS',
    manager: 'Sarah Johnson',
    location: 'San Francisco, CA',
  },
  {
    id: 'EMP-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@acme.com',
    phone: '+1 234 567 8902',
    department: 'Marketing',
    jobTitle: 'Marketing Manager',
    hireDate: '2021-08-20',
    salary: 85000,
    status: 'Active',
    avatar: 'SJ',
    manager: 'CEO',
    location: 'New York, NY',
  },
  {
    id: 'EMP-003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'm.brown@acme.com',
    phone: '+1 234 567 8903',
    department: 'Sales',
    jobTitle: 'Sales Representative',
    hireDate: '2023-01-10',
    salary: 55000,
    status: 'Active',
    avatar: 'MB',
    manager: 'Lisa Chen',
    location: 'Austin, TX',
  },
  {
    id: 'EMP-004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.d@acme.com',
    phone: '+1 234 567 8904',
    department: 'HR',
    jobTitle: 'HR Specialist',
    hireDate: '2022-06-01',
    salary: 65000,
    status: 'On Leave',
    avatar: 'ED',
    manager: 'John Smith',
    location: 'Chicago, IL',
  },
  {
    id: 'EMP-005',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'r.wilson@acme.com',
    phone: '+1 234 567 8905',
    department: 'Finance',
    jobTitle: 'Financial Analyst',
    hireDate: '2021-11-15',
    salary: 75000,
    status: 'Active',
    avatar: 'RW',
    manager: 'Sarah Johnson',
    location: 'San Francisco, CA',
  },
  {
    id: 'EMP-006',
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.c@acme.com',
    phone: '+1 234 567 8906',
    department: 'Sales',
    jobTitle: 'Sales Director',
    hireDate: '2020-05-20',
    salary: 120000,
    status: 'Active',
    avatar: 'LC',
    manager: 'CEO',
    location: 'Los Angeles, CA',
  },
]

const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance']

const departmentData = {
  labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
  data: [12, 8, 15, 5, 6],
}

const salaryData = {
  labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
  datasets: [
    {
      label: 'Avg. Salary',
      data: [95000, 75000, 65000, 60000, 80000],
    },
  ],
}

const statusColors: Record<string, 'success' | 'warning' | 'danger'> = {
  'Active': 'success',
  'On Leave': 'warning',
  'Inactive': 'danger',
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

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === 'All' || employee.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const totalEmployees = employees.length
  const activeEmployees = employees.filter((e) => e.status === 'Active').length
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0)

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
            Employees
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your workforce and employee information
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
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees.toString()}
          icon={Building2}
          trend={{ value: 5.2, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees.toString()}
          icon={UserCheck}
          trend={{ value: 3.1, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="On Leave"
          value={onLeaveCount.toString()}
          icon={Clock}
          trend={{ value: 1, isPositive: false }}
          color="yellow"
          delay={0.2}
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(totalPayroll / 12)}
          icon={DollarSign}
          trend={{ value: 2.5, isPositive: true }}
          color="purple"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
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
          title="Average Salary by Department"
          description="Compensation comparison"
          delay={0.5}
        >
          <BarChart
            labels={salaryData.labels}
            datasets={salaryData.datasets}
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
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="max-w-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  {departments.map((dept) => (
                    <Button
                      key={dept}
                      variant={departmentFilter === dept ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDepartmentFilter(dept)}
                    >
                      {dept}
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
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
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

      {/* Employees Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEmployees.map((employee) => (
              <motion.div key={employee.id} variants={item}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {employee.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {employee.jobTitle}
                        </p>
                        <Badge variant={statusColors[employee.status]} className="mt-1">
                          {employee.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{employee.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedEmployee(employee)
                          setShowDetailModal(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
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
                <CardTitle>All Employees</CardTitle>
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
                          Job Title
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Hire Date
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                          Salary
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
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                  {employee.avatar}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {employee.firstName} {employee.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {employee.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <Badge variant="secondary">{employee.department}</Badge>
                            </td>
                            <td className="py-4 text-sm text-gray-900 dark:text-white">
                              {employee.jobTitle}
                            </td>
                            <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                              {formatDate(employee.hireDate)}
                            </td>
                            <td className="py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(employee.salary)}
                            </td>
                            <td className="py-4">
                              <Badge variant={statusColors[employee.status]}>
                                {employee.status}
                              </Badge>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedEmployee(employee)
                                    setShowDetailModal(true)
                                  }}
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
      </AnimatePresence>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
        description="Enter employee information"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <Input placeholder="First name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <Input placeholder="Last name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <Input type="email" placeholder="email@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <Input type="tel" placeholder="+1 234 567 8901" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department *
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select department...</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>HR</option>
                <option>Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title *
              </label>
              <Input placeholder="Job title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hire Date *
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary
              </label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manager
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select manager...</option>
                {employees.map((e) => (
                  <option key={e.id}>{e.firstName} {e.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <Input placeholder="City, State" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </Modal>

      {/* Employee Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Employee Details"
        size="lg"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {selectedEmployee.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <Badge variant={statusColors[selectedEmployee.status]}>
                    {selectedEmployee.status}
                  </Badge>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{selectedEmployee.jobTitle}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee.id}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEmployee.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Employment Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4" />
                    <span>{selectedEmployee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Briefcase className="h-4 w-4" />
                    <span>Reports to: {selectedEmployee.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Hired: {formatDate(selectedEmployee.hireDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Annual Salary</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedEmployee.salary)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Leave Balance</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  18 days
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tenure</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.floor((new Date().getTime() - new Date(selectedEmployee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Employee
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
