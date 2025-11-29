'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  MessageSquare,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { StatCard } from '@/components/ui/stat-card'
import { ChartWrapper, BarChart, DoughnutChart } from '@/components/charts/charts'
import { formatCurrency, formatDate } from '@/lib/utils'

// Sample leads data
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
    lastContact: '2024-01-15',
    notes: 'Interested in enterprise plan',
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
    createdAt: '2024-01-08',
    lastContact: '2024-01-14',
    notes: 'Sent proposal, awaiting feedback',
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
    assignedTo: 'Mike Brown',
    createdAt: '2024-01-15',
    lastContact: '2024-01-15',
    notes: 'Initial inquiry via LinkedIn',
  },
  {
    id: 'LEAD-004',
    name: 'Emma Davis',
    email: 'emma.d@global.com',
    phone: '+1 555 456 7890',
    company: 'Global Industries',
    source: 'Trade Show',
    status: 'Contacted',
    expectedValue: 120000,
    probability: 40,
    assignedTo: 'John Smith',
    createdAt: '2024-01-05',
    lastContact: '2024-01-12',
    notes: 'Met at tech conference',
  },
  {
    id: 'LEAD-005',
    name: 'David Lee',
    email: 'd.lee@enterprise.io',
    phone: '+1 555 567 8901',
    company: 'Enterprise Solutions',
    source: 'Cold Call',
    status: 'Negotiation',
    expectedValue: 95000,
    probability: 80,
    assignedTo: 'Lisa Chen',
    createdAt: '2024-01-02',
    lastContact: '2024-01-14',
    notes: 'Negotiating contract terms',
  },
  {
    id: 'LEAD-006',
    name: 'Jennifer Brown',
    email: 'jen.b@retail.com',
    phone: '+1 555 678 9012',
    company: 'Retail Corp',
    source: 'Website',
    status: 'Won',
    expectedValue: 67000,
    probability: 100,
    assignedTo: 'Sarah Johnson',
    createdAt: '2023-12-15',
    lastContact: '2024-01-10',
    notes: 'Deal closed - Implementation starting',
  },
  {
    id: 'LEAD-007',
    name: 'Mark Wilson',
    email: 'm.wilson@tech.io',
    phone: '+1 555 789 0123',
    company: 'Tech Innovations',
    source: 'Email Campaign',
    status: 'Lost',
    expectedValue: 55000,
    probability: 0,
    assignedTo: 'Mike Brown',
    createdAt: '2023-12-20',
    lastContact: '2024-01-05',
    notes: 'Went with competitor',
  },
]

const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']

const statusColors: Record<string, 'success' | 'warning' | 'default' | 'secondary' | 'danger'> = {
  New: 'default',
  Contacted: 'secondary',
  Qualified: 'warning',
  Proposal: 'warning',
  Negotiation: 'secondary',
  Won: 'success',
  Lost: 'danger',
}

const pipelineData = {
  labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won'],
  datasets: [
    {
      label: 'Leads',
      data: [5, 8, 12, 6, 4, 10],
      backgroundColor: ['#94A3B8', '#60A5FA', '#FBBF24', '#F97316', '#8B5CF6', '#10B981'],
    },
  ],
}

const sourceData = {
  labels: ['Website', 'Referral', 'Social', 'Trade Show', 'Cold Call', 'Email'],
  data: [12, 8, 6, 4, 5, 10],
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

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null)

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalLeads = leads.length
  const qualifiedLeads = leads.filter((l) => ['Qualified', 'Proposal', 'Negotiation'].includes(l.status)).length
  const wonDeals = leads.filter((l) => l.status === 'Won').length
  const pipelineValue = leads
    .filter((l) => !['Won', 'Lost'].includes(l.status))
    .reduce((sum, l) => sum + l.expectedValue * (l.probability / 100), 0)

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
            Leads
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track your sales leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
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
          color="blue"
          delay={0}
        />
        <StatCard
          title="Qualified Leads"
          value={qualifiedLeads.toString()}
          icon={Target}
          trend={{ value: 8.2, isPositive: true }}
          color="yellow"
          delay={0.1}
        />
        <StatCard
          title="Won Deals"
          value={wonDeals.toString()}
          icon={CheckCircle}
          trend={{ value: 15.3, isPositive: true }}
          color="green"
          delay={0.2}
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(pipelineValue)}
          icon={DollarSign}
          trend={{ value: 10.1, isPositive: true }}
          color="purple"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Lead Pipeline"
          description="Leads by stage"
          delay={0.4}
        >
          <BarChart
            labels={pipelineData.labels}
            datasets={pipelineData.datasets}
            height={250}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Leads by Source"
          description="Lead acquisition channels"
          delay={0.5}
        >
          <DoughnutChart
            labels={sourceData.labels}
            data={sourceData.data}
            height={250}
          />
        </ChartWrapper>
      </div>

      {/* Filters */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-1 gap-4 flex-wrap">
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="max-w-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm text-gray-500 dark:text-gray-400 self-center">Status:</span>
                {statuses.map((status) => (
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Leads Table */}
      <motion.div variants={item}>
        <Card hover={false}>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
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
                    <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      Expected Value
                    </th>
                    <th className="pb-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      Probability
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Assigned To
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
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {lead.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {lead.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-900 dark:text-white">
                          {lead.company}
                        </td>
                        <td className="py-4">
                          <Badge variant="secondary">{lead.source}</Badge>
                        </td>
                        <td className="py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(lead.expectedValue)}
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  lead.probability >= 70 ? 'bg-green-500' :
                                  lead.probability >= 40 ? 'bg-yellow-500' : 'bg-gray-400'
                                }`}
                                style={{ width: `${lead.probability}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {lead.probability}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant={statusColors[lead.status]}>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                          {lead.assignedTo}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedLead(lead)
                                setShowDetailModal(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!['Won', 'Lost'].includes(lead.status) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedLead(lead)
                                  setShowConvertModal(true)
                                }}
                              >
                                <ArrowRight className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
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

      {/* Add Lead Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Lead"
        description="Enter lead information"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Name *
              </label>
              <Input placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company *
              </label>
              <Input placeholder="Company name" />
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
              <Input type="tel" placeholder="+1 555 123 4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
                <option>Trade Show</option>
                <option>Cold Call</option>
                <option>Email Campaign</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assigned To
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>John Smith</option>
                <option>Sarah Johnson</option>
                <option>Mike Brown</option>
                <option>Lisa Chen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Value
              </label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Probability (%)
              </label>
              <Input type="number" placeholder="0" min="0" max="100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Lead</Button>
          </div>
        </form>
      </Modal>

      {/* Lead Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedLead.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{selectedLead.company}</p>
              </div>
              <Badge variant={statusColors[selectedLead.status]} className="text-sm">
                {selectedLead.status}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4" />
                    <span>{selectedLead.company}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Deal Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>Expected Value: {formatCurrency(selectedLead.expectedValue)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Probability: {selectedLead.probability}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Last Contact: {formatDate(selectedLead.lastContact)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedLead.source}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedLead.assignedTo}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedLead.createdAt)}
                </p>
              </div>
            </div>

            {selectedLead.notes && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  {selectedLead.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
              {!['Won', 'Lost'].includes(selectedLead.status) && (
                <Button variant="success" onClick={() => {
                  setShowDetailModal(false)
                  setShowConvertModal(true)
                }}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Move to Next Stage
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Convert Lead Modal */}
      <Modal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        title="Update Lead Status"
        description={`Update status for ${selectedLead?.name}`}
      >
        {selectedLead && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Status
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Proposal</option>
                <option>Negotiation</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Update Probability (%)
              </label>
              <Input type="number" defaultValue={selectedLead.probability} min="0" max="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                rows={3}
                placeholder="Add notes about this status change..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowConvertModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Status</Button>
            </div>
          </form>
        )}
      </Modal>
    </motion.div>
  )
}
