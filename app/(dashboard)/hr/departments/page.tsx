'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Users,
  DollarSign,
  TrendingUp,
  Building2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { StatCard } from '@/components/ui/stat-card'
import { ChartWrapper, BarChart, DoughnutChart } from '@/components/charts/charts'
import { formatCurrency } from '@/lib/utils'

// Sample department data
const departments = [
  {
    id: 'DEPT-001',
    name: 'Engineering',
    description: 'Software development and technical operations',
    manager: 'John Smith',
    managerTitle: 'VP of Engineering',
    employeeCount: 12,
    budget: 1200000,
    headcount: 15,
    color: '#3B82F6',
    subDepartments: ['Frontend', 'Backend', 'DevOps', 'QA'],
  },
  {
    id: 'DEPT-002',
    name: 'Marketing',
    description: 'Brand management and marketing campaigns',
    manager: 'Sarah Johnson',
    managerTitle: 'Marketing Director',
    employeeCount: 8,
    budget: 500000,
    headcount: 10,
    color: '#10B981',
    subDepartments: ['Digital Marketing', 'Content', 'Events'],
  },
  {
    id: 'DEPT-003',
    name: 'Sales',
    description: 'Revenue generation and customer acquisition',
    manager: 'Lisa Chen',
    managerTitle: 'Sales Director',
    employeeCount: 15,
    budget: 800000,
    headcount: 18,
    color: '#F59E0B',
    subDepartments: ['Inside Sales', 'Field Sales', 'SDR'],
  },
  {
    id: 'DEPT-004',
    name: 'HR',
    description: 'Human resources and talent management',
    manager: 'Emily Davis',
    managerTitle: 'HR Manager',
    employeeCount: 5,
    budget: 300000,
    headcount: 6,
    color: '#8B5CF6',
    subDepartments: ['Recruitment', 'Benefits', 'L&D'],
  },
  {
    id: 'DEPT-005',
    name: 'Finance',
    description: 'Financial planning and accounting',
    manager: 'Robert Wilson',
    managerTitle: 'CFO',
    employeeCount: 6,
    budget: 400000,
    headcount: 7,
    color: '#EF4444',
    subDepartments: ['Accounting', 'FP&A', 'Treasury'],
  },
  {
    id: 'DEPT-006',
    name: 'Operations',
    description: 'Business operations and logistics',
    manager: 'Mike Brown',
    managerTitle: 'COO',
    employeeCount: 10,
    budget: 600000,
    headcount: 12,
    color: '#EC4899',
    subDepartments: ['Supply Chain', 'Facilities', 'IT Support'],
  },
]

const headcountData = {
  labels: departments.map((d) => d.name),
  datasets: [
    {
      label: 'Current',
      data: departments.map((d) => d.employeeCount),
      backgroundColor: '#3B82F6',
    },
    {
      label: 'Target',
      data: departments.map((d) => d.headcount),
      backgroundColor: '#93C5FD',
    },
  ],
}

const budgetData = {
  labels: departments.map((d) => d.name),
  data: departments.map((d) => d.budget),
  colors: departments.map((d) => d.color),
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

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<typeof departments[0] | null>(null)

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalDepartments = departments.length
  const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0)
  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0)
  const avgTeamSize = Math.round(totalEmployees / totalDepartments)

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
            Departments
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage organizational structure and departments
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Departments"
          value={totalDepartments.toString()}
          icon={Building2}
          trend={{ value: 1, isPositive: true }}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Total Employees"
          value={totalEmployees.toString()}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          icon={DollarSign}
          trend={{ value: 8.5, isPositive: true }}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Avg. Team Size"
          value={avgTeamSize.toString()}
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: true }}
          color="yellow"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Headcount by Department"
          description="Current vs target headcount"
          delay={0.4}
        >
          <BarChart
            labels={headcountData.labels}
            datasets={headcountData.datasets}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Budget Allocation"
          description="Annual budget by department"
          delay={0.5}
        >
          <DoughnutChart
            labels={budgetData.labels}
            data={budgetData.data}
            colors={budgetData.colors}
            height={250}
          />
        </ChartWrapper>
      </div>

      {/* Search */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardContent className="p-4">
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              className="max-w-sm"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Departments Grid */}
      <motion.div variants={container} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredDepartments.map((department) => (
            <motion.div key={department.id} variants={item}>
              <Card
                className="h-full cursor-pointer"
                onClick={() => {
                  setSelectedDepartment(department)
                  setShowDetailModal(true)
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${department.color}20` }}
                      >
                        <Building2 className="h-6 w-6" style={{ color: department.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {department.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {department.employeeCount} employees
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {department.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                      {department.manager.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {department.manager}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {department.managerTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {department.subDepartments.slice(0, 3).map((sub) => (
                      <Badge key={sub} variant="secondary" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                    {department.subDepartments.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{department.subDepartments.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Budget</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(department.budget)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Headcount</span>
                        <span>{department.employeeCount}/{department.headcount}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(department.employeeCount / department.headcount) * 100}%`,
                            backgroundColor: department.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Department Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Department"
        description="Create a new department in your organization"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department Name *
              </label>
              <Input placeholder="e.g., Engineering" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                rows={2}
                placeholder="Brief description of the department..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department Manager
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Select manager...</option>
                <option>John Smith</option>
                <option>Sarah Johnson</option>
                <option>Lisa Chen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Headcount
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Annual Budget
              </label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <Input type="color" defaultValue="#3B82F6" className="h-10" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Department</Button>
          </div>
        </form>
      </Modal>

      {/* Department Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedDepartment?.name || 'Department Details'}
        size="lg"
      >
        {selectedDepartment && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div
                className="h-16 w-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedDepartment.color}20` }}
              >
                <Building2 className="h-8 w-8" style={{ color: selectedDepartment.color }} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedDepartment.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedDepartment.description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Employees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedDepartment.employeeCount}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    /{selectedDepartment.headcount}
                  </span>
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Annual Budget</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedDepartment.budget)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Teams</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedDepartment.subDepartments.length}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Department Head</h4>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {selectedDepartment.manager.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedDepartment.manager}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedDepartment.managerTitle}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Sub-departments / Teams</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDepartment.subDepartments.map((sub) => (
                  <Badge key={sub} variant="secondary" className="px-3 py-1">
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View Employees
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Department
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
