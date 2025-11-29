'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Package,
  Receipt,
  Users,
  UserCircle,
  BarChart3,
  Building2,
  FileText,
  Truck,
  Calendar,
  MessageSquare,
  Mail,
  Globe,
  Megaphone,
  Wrench,
  Briefcase,
  GraduationCap,
  Heart,
  Search,
  Check,
  Star,
  ArrowLeft,
  Filter,
  Grid3X3,
  List,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'

// All available applications (Odoo-inspired)
const allApplications = [
  // Sales
  {
    id: 'sales',
    name: 'Sales',
    description: 'Manage quotations, sales orders, and invoicing with advanced analytics',
    longDescription: 'Complete sales management solution with pipeline tracking, quotation templates, automatic invoicing, and comprehensive sales analytics. Integrate with CRM for seamless lead-to-customer conversion.',
    icon: ShoppingCart,
    color: 'from-blue-500 to-blue-600',
    category: 'Sales',
    price: 15,
    rating: 4.9,
    reviews: 1250,
    users: '50K+',
    features: [
      'Sales Orders Management',
      'Quotation Templates',
      'Customer Portal',
      'Sales Analytics Dashboard',
      'Multi-currency Support',
      'Discount & Pricing Rules',
      'Sales Team Management',
      'Commission Tracking',
    ],
    integrations: ['CRM', 'Inventory', 'Accounting'],
    popular: true,
    installed: false,
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Track leads, manage opportunities, and automate sales pipeline',
    longDescription: 'Powerful CRM system to manage your entire sales funnel. From lead generation to deal closure, track every interaction and automate follow-ups.',
    icon: UserCircle,
    color: 'from-purple-500 to-purple-600',
    category: 'Sales',
    price: 15,
    rating: 4.8,
    reviews: 980,
    users: '45K+',
    features: [
      'Lead Management',
      'Opportunity Tracking',
      'Pipeline Visualization',
      'Activity Scheduling',
      'Email Integration',
      'Lead Scoring',
      'Automated Actions',
      'Sales Forecasting',
    ],
    integrations: ['Sales', 'Marketing', 'Email'],
    popular: true,
    installed: false,
  },
  {
    id: 'pos',
    name: 'Point of Sale',
    description: 'Fast and reliable POS for retail and restaurant businesses',
    longDescription: 'User-friendly point of sale solution that works online and offline. Perfect for retail stores, restaurants, and any business that needs quick checkout.',
    icon: Receipt,
    color: 'from-green-500 to-green-600',
    category: 'Sales',
    price: 20,
    rating: 4.7,
    reviews: 650,
    users: '25K+',
    features: [
      'Offline Mode',
      'Multiple Payment Methods',
      'Barcode Scanning',
      'Receipt Customization',
      'Customer Display',
      'Split Payments',
      'Table Management',
      'Kitchen Display',
    ],
    integrations: ['Inventory', 'Accounting', 'Sales'],
    popular: false,
    installed: false,
  },
  // Operations
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Complete warehouse management with real-time stock tracking',
    longDescription: 'Advanced inventory management with multi-warehouse support, automated reordering, and detailed stock reports. Track products from receipt to delivery.',
    icon: Package,
    color: 'from-orange-500 to-orange-600',
    category: 'Operations',
    price: 20,
    rating: 4.9,
    reviews: 1100,
    users: '40K+',
    features: [
      'Multi-warehouse Support',
      'Stock Transfers',
      'Barcode/QR Scanning',
      'Automated Reordering',
      'Inventory Valuation',
      'Batch/Serial Tracking',
      'Stock Alerts',
      'Inventory Reports',
    ],
    integrations: ['Sales', 'Purchase', 'Manufacturing'],
    popular: true,
    installed: false,
  },
  {
    id: 'purchase',
    name: 'Purchase',
    description: 'Streamline procurement with automated purchase orders',
    longDescription: 'Efficient purchase management with vendor comparison, automated RFQs, and approval workflows. Reduce costs and improve supplier relationships.',
    icon: Truck,
    color: 'from-teal-500 to-teal-600',
    category: 'Operations',
    price: 15,
    rating: 4.6,
    reviews: 520,
    users: '20K+',
    features: [
      'Purchase Orders',
      'Request for Quotation',
      'Vendor Management',
      'Price Comparison',
      'Approval Workflows',
      'Vendor Contracts',
      'Purchase Analytics',
      'Automated Reordering',
    ],
    integrations: ['Inventory', 'Accounting'],
    popular: false,
    installed: false,
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Plan and manage manufacturing operations efficiently',
    longDescription: 'Complete manufacturing solution with BOM management, work orders, and production planning. Optimize your manufacturing process and reduce waste.',
    icon: Wrench,
    color: 'from-slate-500 to-slate-600',
    category: 'Operations',
    price: 25,
    rating: 4.5,
    reviews: 380,
    users: '15K+',
    features: [
      'Bill of Materials',
      'Work Orders',
      'Production Planning',
      'Work Centers',
      'Quality Control',
      'MRP Scheduling',
      'Cost Tracking',
      'Maintenance',
    ],
    integrations: ['Inventory', 'Purchase', 'Quality'],
    popular: false,
    installed: false,
  },
  // Finance
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Complete financial management with invoicing and reporting',
    longDescription: 'Full-featured accounting software with automated invoicing, bank reconciliation, and comprehensive financial reports. Stay compliant with local regulations.',
    icon: Receipt,
    color: 'from-emerald-500 to-emerald-600',
    category: 'Finance',
    price: 25,
    rating: 4.8,
    reviews: 890,
    users: '35K+',
    features: [
      'Invoicing',
      'Bank Reconciliation',
      'Financial Reports',
      'Tax Management',
      'Multi-currency',
      'Asset Management',
      'Budget Management',
      'Audit Trail',
    ],
    integrations: ['Sales', 'Purchase', 'Inventory'],
    popular: true,
    installed: false,
  },
  {
    id: 'expenses',
    name: 'Expenses',
    description: 'Track and manage employee expenses with approval workflows',
    longDescription: 'Streamline expense management with mobile receipt capture, automated approvals, and integration with accounting for seamless reimbursement.',
    icon: FileText,
    color: 'from-yellow-500 to-yellow-600',
    category: 'Finance',
    price: 10,
    rating: 4.6,
    reviews: 420,
    users: '18K+',
    features: [
      'Receipt Scanning',
      'Expense Categories',
      'Approval Workflows',
      'Policy Enforcement',
      'Mileage Tracking',
      'Per Diem Rules',
      'Expense Reports',
      'Credit Card Import',
    ],
    integrations: ['Accounting', 'HR'],
    popular: false,
    installed: false,
  },
  // Human Resources
  {
    id: 'hr',
    name: 'Employees',
    description: 'Centralize employee information and HR processes',
    longDescription: 'Complete employee management with org charts, contract management, and document storage. The foundation for all HR applications.',
    icon: Users,
    color: 'from-pink-500 to-pink-600',
    category: 'Human Resources',
    price: 15,
    rating: 4.7,
    reviews: 720,
    users: '30K+',
    features: [
      'Employee Directory',
      'Org Charts',
      'Contract Management',
      'Document Storage',
      'Skills Management',
      'Department Structure',
      'Work Locations',
      'Employee Portal',
    ],
    integrations: ['Recruitment', 'Time Off', 'Payroll'],
    popular: true,
    installed: false,
  },
  {
    id: 'recruitment',
    name: 'Recruitment',
    description: 'Streamline hiring with job postings and applicant tracking',
    longDescription: 'End-to-end recruitment solution from job posting to onboarding. Track applicants, schedule interviews, and collaborate with hiring managers.',
    icon: Briefcase,
    color: 'from-indigo-500 to-indigo-600',
    category: 'Human Resources',
    price: 15,
    rating: 4.5,
    reviews: 340,
    users: '12K+',
    features: [
      'Job Postings',
      'Applicant Tracking',
      'Resume Parsing',
      'Interview Scheduling',
      'Collaboration Tools',
      'Offer Management',
      'Onboarding',
      'Recruitment Analytics',
    ],
    integrations: ['Employees', 'Website'],
    popular: false,
    installed: false,
  },
  {
    id: 'timeoff',
    name: 'Time Off',
    description: 'Manage leave requests and time-off policies',
    longDescription: 'Flexible leave management with custom policies, approval workflows, and calendar integration. Employees can request time off from anywhere.',
    icon: Calendar,
    color: 'from-cyan-500 to-cyan-600',
    category: 'Human Resources',
    price: 10,
    rating: 4.8,
    reviews: 560,
    users: '25K+',
    features: [
      'Leave Types',
      'Approval Workflows',
      'Calendar View',
      'Accrual Rules',
      'Public Holidays',
      'Team Planning',
      'Mobile Requests',
      'Leave Reports',
    ],
    integrations: ['Employees', 'Planning'],
    popular: false,
    installed: false,
  },
  {
    id: 'payroll',
    name: 'Payroll',
    description: 'Automate payroll processing with tax calculations',
    longDescription: 'Comprehensive payroll solution with automatic calculations, tax compliance, and direct deposits. Support for multiple pay structures and benefits.',
    icon: Receipt,
    color: 'from-violet-500 to-violet-600',
    category: 'Human Resources',
    price: 30,
    rating: 4.6,
    reviews: 290,
    users: '10K+',
    features: [
      'Salary Structures',
      'Automatic Calculations',
      'Tax Compliance',
      'Payslips',
      'Direct Deposits',
      'Benefits Management',
      'Payroll Reports',
      'Year-end Processing',
    ],
    integrations: ['Employees', 'Accounting', 'Time Off'],
    popular: false,
    installed: false,
  },
  // Marketing
  {
    id: 'marketing',
    name: 'Email Marketing',
    description: 'Create and send beautiful email campaigns',
    longDescription: 'Powerful email marketing with drag-and-drop editor, audience segmentation, and detailed analytics. Automate campaigns and track conversions.',
    icon: Mail,
    color: 'from-rose-500 to-rose-600',
    category: 'Marketing',
    price: 15,
    rating: 4.4,
    reviews: 380,
    users: '15K+',
    features: [
      'Email Templates',
      'Drag & Drop Editor',
      'Audience Segmentation',
      'A/B Testing',
      'Campaign Analytics',
      'Automation',
      'Contact Lists',
      'Unsubscribe Management',
    ],
    integrations: ['CRM', 'Website'],
    popular: false,
    installed: false,
  },
  {
    id: 'social',
    name: 'Social Marketing',
    description: 'Manage and schedule social media content',
    longDescription: 'Centralize your social media management with scheduling, monitoring, and analytics across all major platforms.',
    icon: Megaphone,
    color: 'from-fuchsia-500 to-fuchsia-600',
    category: 'Marketing',
    price: 15,
    rating: 4.3,
    reviews: 210,
    users: '8K+',
    features: [
      'Multi-platform Posting',
      'Content Calendar',
      'Social Monitoring',
      'Analytics Dashboard',
      'Team Collaboration',
      'Asset Library',
      'Hashtag Tracking',
      'Engagement Reports',
    ],
    integrations: ['Website', 'CRM'],
    popular: false,
    installed: false,
  },
  // Productivity
  {
    id: 'project',
    name: 'Project',
    description: 'Plan and track projects with tasks and milestones',
    longDescription: 'Flexible project management with multiple views, time tracking, and collaboration tools. Keep teams aligned and projects on track.',
    icon: Briefcase,
    color: 'from-amber-500 to-amber-600',
    category: 'Productivity',
    price: 15,
    rating: 4.7,
    reviews: 680,
    users: '28K+',
    features: [
      'Task Management',
      'Kanban View',
      'Gantt Charts',
      'Time Tracking',
      'Milestones',
      'Recurring Tasks',
      'Subtasks',
      'Project Templates',
    ],
    integrations: ['Timesheet', 'Documents'],
    popular: true,
    installed: false,
  },
  {
    id: 'discuss',
    name: 'Discuss',
    description: 'Team communication and messaging platform',
    longDescription: 'Real-time team communication with channels, direct messages, and video calls. Keep your team connected and productive.',
    icon: MessageSquare,
    color: 'from-sky-500 to-sky-600',
    category: 'Productivity',
    price: 0,
    rating: 4.5,
    reviews: 450,
    users: '35K+',
    features: [
      'Channels',
      'Direct Messages',
      'Video Calls',
      'File Sharing',
      'Mentions',
      'Thread Replies',
      'Search',
      'Integrations',
    ],
    integrations: ['All Apps'],
    popular: false,
    installed: true,
  },
  {
    id: 'website',
    name: 'Website Builder',
    description: 'Build stunning websites with drag-and-drop editor',
    longDescription: 'Create professional websites without coding. Drag-and-drop editor, beautiful themes, and seamless integration with all business apps.',
    icon: Globe,
    color: 'from-lime-500 to-lime-600',
    category: 'Productivity',
    price: 20,
    rating: 4.6,
    reviews: 520,
    users: '22K+',
    features: [
      'Drag & Drop Editor',
      'Theme Library',
      'SEO Tools',
      'Blog',
      'eCommerce',
      'Forms',
      'Analytics',
      'Multi-language',
    ],
    integrations: ['eCommerce', 'CRM', 'Blog'],
    popular: false,
    installed: false,
  },
  {
    id: 'elearning',
    name: 'eLearning',
    description: 'Create and manage online courses and training',
    longDescription: 'Build engaging online courses with quizzes, certifications, and progress tracking. Perfect for employee training or selling courses.',
    icon: GraduationCap,
    color: 'from-red-500 to-red-600',
    category: 'Productivity',
    price: 15,
    rating: 4.4,
    reviews: 180,
    users: '6K+',
    features: [
      'Course Builder',
      'Video Hosting',
      'Quizzes',
      'Certifications',
      'Progress Tracking',
      'Student Portal',
      'Forums',
      'Course Selling',
    ],
    integrations: ['Website', 'HR'],
    popular: false,
    installed: false,
  },
  // Services
  {
    id: 'helpdesk',
    name: 'Helpdesk',
    description: 'Manage customer support tickets efficiently',
    longDescription: 'Professional helpdesk solution with ticket management, SLAs, and knowledge base. Deliver exceptional customer support.',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    category: 'Services',
    price: 15,
    rating: 4.7,
    reviews: 410,
    users: '16K+',
    features: [
      'Ticket Management',
      'SLA Policies',
      'Knowledge Base',
      'Email Integration',
      'Customer Portal',
      'Canned Responses',
      'Ticket Tags',
      'Performance Reports',
    ],
    integrations: ['CRM', 'Website'],
    popular: false,
    installed: false,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Business intelligence and custom dashboards',
    longDescription: 'Powerful analytics platform to visualize data from all your apps. Create custom dashboards and reports for data-driven decisions.',
    icon: BarChart3,
    color: 'from-cyan-500 to-cyan-600',
    category: 'Productivity',
    price: 20,
    rating: 4.8,
    reviews: 340,
    users: '14K+',
    features: [
      'Custom Dashboards',
      'Real-time Data',
      'Chart Builder',
      'Spreadsheet View',
      'Pivot Tables',
      'Scheduled Reports',
      'Data Export',
      'Sharing',
    ],
    integrations: ['All Apps'],
    popular: true,
    installed: false,
  },
]

const categories = ['All', 'Sales', 'Operations', 'Finance', 'Human Resources', 'Marketing', 'Productivity', 'Services']

export default function AppStorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [installedApps, setInstalledApps] = useState<string[]>(['discuss'])
  const { theme, setTheme } = useTheme()

  const filteredApps = allApplications.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleInstall = (appId: string) => {
    if (installedApps.includes(appId)) {
      setInstalledApps(installedApps.filter((id) => id !== appId))
    } else {
      setInstalledApps([...installedApps, appId])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">App Store</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Sun className="h-5 w-5 hidden dark:block text-gray-300" />
                <Moon className="h-5 w-5 dark:hidden text-gray-600" />
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Discover Apps for Your Business
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Choose from our collection of powerful applications. Install only what you need, pay only for what you use.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-8 text-sm"
          >
            <div>
              <span className="font-semibold">{allApplications.length}</span> Apps Available
            </div>
            <div>
              <span className="font-semibold">{installedApps.length}</span> Installed
            </div>
            <div>
              <span className="font-semibold">{categories.length - 1}</span> Categories
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Installed Apps Section */}
        {installedApps.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Installed Apps ({installedApps.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allApplications
                .filter((app) => installedApps.includes(app.id))
                .map((app) => {
                  const Icon = app.icon
                  return (
                    <motion.div
                      key={app.id}
                      layout
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow"
                    >
                      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{app.name}</h3>
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs">
                          <Check className="h-3 w-3" />
                          Installed
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </section>
        )}

        {/* Popular Apps Section */}
        {selectedCategory === 'All' && !searchQuery && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Popular Apps
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allApplications
                .filter((app) => app.popular && !installedApps.includes(app.id))
                .slice(0, 3)
                .map((app, index) => {
                  const Icon = app.icon
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {app.rating}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{app.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{app.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {app.price === 0 ? 'Free' : `$${app.price}/mo`}
                        </span>
                        <button
                          onClick={() => toggleInstall(app.id)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                          Install
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </section>
        )}

        {/* All Apps */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {selectedCategory === 'All' ? 'All Applications' : selectedCategory}
            <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
              ({filteredApps.filter((app) => !installedApps.includes(app.id)).length})
            </span>
          </h2>

          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps
                .filter((app) => !installedApps.includes(app.id))
                .map((app, index) => {
                  const Icon = app.icon
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{app.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{app.category}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{app.description}</p>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {app.rating} ({app.reviews})
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">{app.users} users</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {app.price === 0 ? 'Free' : `$${app.price}/mo`}
                        </span>
                        <button
                          onClick={() => toggleInstall(app.id)}
                          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-blue-600 hover:text-white transition-all"
                        >
                          Install
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps
                .filter((app) => !installedApps.includes(app.id))
                .map((app, index) => {
                  const Icon = app.icon
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                              {app.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{app.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {app.rating} ({app.reviews} reviews)
                            </div>
                            <span>{app.users} users</span>
                            <span>Integrates with: {app.integrations.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="font-semibold text-gray-900 dark:text-white text-lg">
                            {app.price === 0 ? 'Free' : `$${app.price}/mo`}
                          </span>
                          <button
                            onClick={() => toggleInstall(app.id)}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                          >
                            Install
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          )}

          {filteredApps.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No apps found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
