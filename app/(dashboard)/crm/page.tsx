'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Download,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  ArrowRight,
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
const leads = [
  {
    id: 'LEAD-001',
    name: 'Robert Chen',
    email: 'robert.chen@techcorp.com',
    phone: '+1 555 123 4567',
    company: 'TechCorp Inc.',
    source: 'Website',
    status: 'Qualified',
    expectedValue: 45000,
    probability: 75,
    assignedTo: 'John Smith',
    createdAt: '2024-01-10',
  },
  {
    id: 'LEAD-002',
    name: 'Lisa Wang',
    email: 'lisa.w@innovate.io',
    phone: '+1 555 234 5678',
    company: 'Innovate Solutions',
    source: 'Referral',
    status: 'Proposal',
    expectedValue: 78000,
    probability: 60,
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-12',
  },
  {
    id: 'LEAD-003',
    name: 'James Miller',
    email: 'j.miller@startup.co',
    phone: '+1 555 345 6789',
    company: 'StartUp Co',
    source: 'Social Media',
    status: 'New',
    expectedValue: 25000,
    probability: 20,
    assignedTo: 'John Smith',
    createdAt: '2024-01-15',
  },
  {
    id: 'LEAD-004',
    name: 'Emma Thompson',
    email: 'emma.t@enterprise.com',
    phone: '+1 555 456 7890',
    company: 'Enterprise Ltd',
    source: 'Trade Show',
    status: 'Negotiation',
    expectedValue: 120000,
    probability: 85,
    assignedTo: 'Michael Brown',
    createdAt: '2024-01-08',
  },
  {
    id: 'LEAD-005',
    name: 'David Lee',
    email: 'd.lee@globaltech.com',
    phone: '+1 555 567 8901',
    company: 'GlobalTech',
    source: 'Email Campaign',
    status: 'Contacted',
    expectedValue: 35000,
    probability: 40,
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-14',
  },
]

const pipelineStages = [
  { name: 'New', count: 12, value: 180000, color: '#6366F1' },
  { name: 'Contacted', count: 8, value: 145000, color: '#8B5CF6' },
  { name: 'Qualified', count: 6, value: 210000, color: '#3B82F6' },
  { name: 'Proposal', count: 4, value: 280000, color: '#10B981' },
  { name: 'Negotiation', count: 3, value: 350000, color: '#F59E0B' },
  { name: 'Won', count: 15, value: 890000, color: '#22C55E' },
]

const leadsBySource = {
  labels: ['Website', 'Referral', 'Social Media', 'Trade Show', 'Email Campaign', 'Cold Call'],
  data: [35, 25, 15, 12, 8, 5],
}

const conversionData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Leads',
      data: [45, 52, 48, 61, 55, 67],
      backgroundColor: '#6366F1',
    },
    {
      label: 'Conversions',
      data: [12, 15, 14, 18, 16, 22],
      backgroundColor: '#10B981',
    },
  ],
}

const monthlyRevenue = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Won Deals',
      data: [120000, 145000, 135000, 175000, 155000, 190000],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
  ],
}

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  New: 'default',
  Contacted: 'secondary',
  Qualified: 'success',
  Proposal: 'warning',
  Negotiation: 'warning',
  Won: 'success',
  Lost: 'danger',
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

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list')

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalLeads = leads.length
  const totalValue = leads.reduce((sum, l) => sum + l.expectedValue, 0)
  const avgProbability = Math.round(leads.reduce((sum, l) => sum + l.probability, 0) / leads.length)
  const qualifiedLeads = leads.filter((l) => ['Qualified', 'Proposal', 'Negotiation'].includes(l.status)).length

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
            CRM
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage leads, opportunities, and customer relationships
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'pipeline'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Pipeline
            </button>
          </div>
          <Button onClick={() => setShowNewLeadModal(true)}>
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={totalLeads.toString()}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          color="indigo"
          delay={0}
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(totalValue)}
          icon={DollarSign}
          trend={{ value: 18.2, isPositive: true }}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Qualified Leads"
          value={qualifiedLeads.toString()}
          icon={Target}
          trend={{ value: 8.5, isPositive: true }}
          color="blue"
          delay={0.2}
        />
        <StatCard
          title="Avg. Probability"
          value={`${avgProbability}%`}
          icon={TrendingUp}
          trend={{ value: 5.2, isPositive: true }}
          color="purple"
          delay={0.3}
        />
      </div>

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <motion.div variants={item} className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {pipelineStages.map((stage, index) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-72 flex-shrink-0"
              >
                <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                  <div
                    className="h-1"
                    style={{ backgroundColor: stage.color }}
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {stage.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {stage.count}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {formatCurrency(stage.value)}
                    </p>
                    <div className="space-y-3">
                      {leads
                        .filter((l) => l.status === stage.name)
                        .map((lead) => (
                          <motion.div
                            key={lead.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedLead(lead)}
                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {lead.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {lead.company}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                {formatCurrency(lead.expectedValue)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {lead.probability}%
                              </span>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWrapper
          title="Leads by Source"
          description="Distribution by lead source"
          delay={0.4}
        >
          <DoughnutChart
            labels={leadsBySource.labels}
            data={leadsBySource.data}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Conversion Funnel"
          description="Leads vs conversions"
          delay={0.5}
          className="lg:col-span-2"
        >
          <BarChart
            labels={conversionData.labels}
            datasets={conversionData.datasets}
            height={250}
          />
        </ChartWrapper>
      </div>

      {/* Leads Table */}
      {viewMode === 'list' && (
        <motion.div variants={item}>
          <Card hover={false}>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Leads</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Search leads..."
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
                        Lead
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Company
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Source
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Value
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Probability
                      </th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredLeads.map((lead, index) => (
                        <motion.tr
                          key={lead.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium">
                                {getInitials(lead.name)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {lead.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {lead.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {lead.company}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                            {lead.source}
                          </td>
                          <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(lead.expectedValue)}
                          </td>
                          <td className="py-4">
                            <Badge variant={statusColors[lead.status]}>
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${lead.probability}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {lead.probability}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedLead(lead)}
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

      {/* Revenue Trend */}
      <motion.div variants={item}>
        <ChartWrapper
          title="Won Deals Revenue"
          description="Monthly revenue from closed deals"
          delay={0.6}
        >
          <LineChart
            labels={monthlyRevenue.labels}
            datasets={monthlyRevenue.datasets}
            height={300}
          />
        </ChartWrapper>
      </motion.div>

      {/* New Lead Modal */}
      <Modal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        title="Add New Lead"
        description="Fill in the details to add a new lead"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Name
              </label>
              <Input placeholder="Enter name..." />
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
                Company
              </label>
              <Input placeholder="Enter company..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source
              </label>
              <Input placeholder="Select source..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Value
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
            <Button variant="outline" onClick={() => setShowNewLeadModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Lead</Button>
          </div>
        </form>
      </Modal>

      {/* Lead Details Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-medium">
                {getInitials(selectedLead.name)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedLead.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedLead.company}
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedLead.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedLead.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedLead.source}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant={statusColors[selectedLead.status]}>
                  {selectedLead.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expected Value</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedLead.expectedValue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Probability</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${selectedLead.probability}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedLead.probability}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedLead.assignedTo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedLead.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline">
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
              <Button>
                <ArrowRight className="h-4 w-4" />
                Move to Next Stage
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
