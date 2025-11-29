'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Package,
  Receipt,
  Users,
  UserCircle,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Layers,
  Menu,
  X,
  Play,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'

// Application data inspired by Odoo
const applications = [
  {
    id: 'sales',
    name: 'Sales',
    description: 'Manage your sales pipeline, quotations, and orders with powerful analytics',
    icon: ShoppingCart,
    color: 'from-blue-500 to-blue-600',
    features: ['Sales Orders', 'Quotations', 'Customer Management', 'Sales Analytics', 'Pipeline Tracking'],
    category: 'Sales',
    popular: true,
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Track leads, manage opportunities, and close more deals',
    icon: UserCircle,
    color: 'from-purple-500 to-purple-600',
    features: ['Lead Management', 'Pipeline View', 'Opportunity Tracking', 'Email Integration', 'Activity Scheduling'],
    category: 'Sales',
    popular: true,
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Full warehouse management with real-time stock tracking',
    icon: Package,
    color: 'from-orange-500 to-orange-600',
    features: ['Product Management', 'Stock Tracking', 'Warehouse Management', 'Stock Transfers', 'Inventory Reports'],
    category: 'Operations',
    popular: true,
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Complete financial management with invoicing and payments',
    icon: Receipt,
    color: 'from-green-500 to-green-600',
    features: ['Invoicing', 'Payment Tracking', 'Financial Reports', 'Bank Reconciliation', 'Tax Management'],
    category: 'Finance',
    popular: true,
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Manage employees, attendance, leaves, and payroll',
    icon: Users,
    color: 'from-pink-500 to-pink-600',
    features: ['Employee Directory', 'Attendance Tracking', 'Leave Management', 'Payroll', 'Performance Reviews'],
    category: 'Human Resources',
    popular: false,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Powerful dashboards and business intelligence tools',
    icon: BarChart3,
    color: 'from-cyan-500 to-cyan-600',
    features: ['Custom Dashboards', 'Real-time Reports', 'KPI Tracking', 'Data Visualization', 'Export Tools'],
    category: 'Productivity',
    popular: false,
  },
]

// Pricing plans
const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out our platform',
    price: 0,
    billingPeriod: 'forever',
    apps: 1,
    users: 2,
    features: [
      'Access to 1 application',
      'Up to 2 users',
      '1,000 records limit',
      'Community support',
      'Basic reporting',
    ],
    limitations: [
      'Limited storage (500MB)',
      'No API access',
      'No custom branding',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Great for small businesses',
    price: 29,
    billingPeriod: 'per user/month',
    apps: 3,
    users: 10,
    features: [
      'Access to 3 applications',
      'Up to 10 users',
      '10,000 records limit',
      'Email support',
      'Advanced reporting',
      '5GB storage',
      'Basic API access',
    ],
    limitations: [
      'No custom branding',
    ],
    cta: 'Start Trial',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Best for growing companies',
    price: 59,
    billingPeriod: 'per user/month',
    apps: -1, // unlimited
    users: 50,
    features: [
      'All applications included',
      'Up to 50 users',
      'Unlimited records',
      'Priority support',
      'Custom reports',
      '25GB storage',
      'Full API access',
      'Custom branding',
      'SSO integration',
    ],
    limitations: [],
    cta: 'Start Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: -1, // custom
    billingPeriod: 'custom',
    apps: -1,
    users: -1,
    features: [
      'All applications included',
      'Unlimited users',
      'Unlimited records',
      'Dedicated support',
      'Custom development',
      'Unlimited storage',
      'Advanced API',
      'On-premise option',
      'SLA guarantee',
      'Security audit',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
]

// Testimonials
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart Inc',
    image: 'SJ',
    content: 'This ERP system transformed our operations. We reduced manual work by 60% and improved our decision-making with real-time analytics.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director, Global Industries',
    image: 'MC',
    content: 'The modular approach is perfect. We started with Sales and Inventory, then added more apps as we grew. Seamless integration!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Finance Manager, Acme Corp',
    image: 'ER',
    content: 'Finally, an ERP that is easy to use! Our team was productive within days, not months. The support team is exceptional.',
    rating: 5,
  },
]

// Stats
const stats = [
  { value: '10,000+', label: 'Companies Trust Us' },
  { value: '50+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedApps, setSelectedApps] = useState<string[]>(['sales'])
  const { theme, setTheme } = useTheme()

  const toggleApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      if (selectedApps.length > 1) {
        setSelectedApps(selectedApps.filter((id) => id !== appId))
      }
    } else {
      setSelectedApps([...selectedApps, appId])
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">NexusERP</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#applications" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Applications
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Testimonials
              </a>
              <Link href="/app-store" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                App Store
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Sun className="h-5 w-5 hidden dark:block text-gray-300" />
                <Moon className="h-5 w-5 dark:hidden text-gray-600" />
              </button>
              <Link
                href="/auth/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#applications" className="block text-gray-600 dark:text-gray-300">Applications</a>
                <a href="#pricing" className="block text-gray-600 dark:text-gray-300">Pricing</a>
                <a href="#testimonials" className="block text-gray-600 dark:text-gray-300">Testimonials</a>
                <Link href="/app-store" className="block text-gray-600 dark:text-gray-300">App Store</Link>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <Link href="/auth/login" className="block text-gray-600 dark:text-gray-300">Sign In</Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                <span>All-in-one Business Suite</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Build Your Perfect
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> Business Suite</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Choose only the applications you need. Scale as you grow. One platform, unlimited possibilities. Just like Odoo, but with a modern twist.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-3 gap-4">
                  {applications.slice(0, 6).map((app, index) => {
                    const Icon = app.icon
                    const isSelected = selectedApps.includes(app.id)
                    return (
                      <motion.button
                        key={app.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleApp(app.id)}
                        className={`relative p-4 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-white dark:bg-gray-700 shadow-lg ring-2 ring-blue-500'
                            : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-2`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</div>
                      </motion.button>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Selected apps: {selectedApps.length}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      ${selectedApps.length === 1 ? 'Free' : `${selectedApps.length * 15}/mo`}
                    </span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-gray-500 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose NexusERP?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built with modern technology and designed for the way you work
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Layers, title: 'Modular Design', description: 'Pay only for what you use. Add or remove apps anytime.' },
              { icon: Zap, title: 'Lightning Fast', description: 'Built with Next.js for optimal performance and speed.' },
              { icon: Shield, title: 'Enterprise Security', description: 'Bank-grade encryption and compliance certifications.' },
              { icon: Globe, title: 'Global Ready', description: 'Multi-language, multi-currency, multi-timezone support.' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section id="applications" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Applications
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to run your business, all in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app, index) => {
              const Icon = app.icon
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  {app.popular && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium rounded-full">
                      Popular
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{app.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{app.description}</p>
                  <ul className="space-y-2 mb-6">
                    {app.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/app-store/${app.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:gap-3 transition-all"
                  >
                    Learn More
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/app-store"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              View All Applications
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  {plan.price === -1 ? (
                    <div className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Custom
                    </div>
                  ) : plan.price === 0 ? (
                    <div className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Free
                    </div>
                  ) : (
                    <>
                      <span className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        ${plan.price}
                      </span>
                      <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        /{plan.billingPeriod}
                      </span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-blue-50' : 'text-gray-600 dark:text-gray-400'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.id === 'enterprise' ? '/contact' : '/auth/register'}
                  className={`block w-full text-center py-3 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Businesses Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See what our customers have to say about NexusERP
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of companies already using NexusERP. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-lg"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/app-store" className="hover:text-white transition-colors">Applications</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-white">NexusERP</span>
            </div>
            <p className="text-sm">© 2024 NexusERP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
