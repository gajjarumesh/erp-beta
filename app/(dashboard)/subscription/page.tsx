'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Users,
  HardDrive,
  ArrowUpRight,
  Calendar,
  CreditCard,
  AlertCircle,
  Check,
  Settings,
  Loader2,
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/lib/stores/auth-store'

interface CustomPackage {
  id: string
  name: string
  totalYearlyPrice: number
  status: string
  activatedAt?: string
  modules: Array<{ id: string; name: string; yearlyPrice: number }>
  limits: Array<{ limitType: { name: string; unit: string }; limitValue: number }>
}

export default function SubscriptionPage() {
  const { user } = useAuthStore()
  const [currentPackage, setCurrentPackage] = useState<CustomPackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.packages.getCustomPackages()
      if (response.data && response.data.length > 0) {
        // Get the active package
        const activePackage = response.data.find((pkg: CustomPackage) => pkg.status === 'active')
        setCurrentPackage(activePackage || response.data[0])
      }
    } catch (err) {
      setError('Failed to load subscription data')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!currentPackage) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Active Subscription
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have an active subscription yet. Build your custom package to get started.
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
        >
          Build Your Package
          <ArrowUpRight className="h-5 w-5" />
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription and billing
          </p>
        </div>
        <a
          href="/pricing"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
        >
          <Settings className="h-4 w-4" />
          Manage Package
        </a>
      </div>

      {/* Current Package Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-100 mb-2">Current Package</p>
            <h2 className="text-3xl font-bold">{currentPackage.name}</h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentPackage.status === 'active'
                ? 'bg-green-500/20 text-green-100'
                : 'bg-yellow-500/20 text-yellow-100'
            }`}
          >
            {currentPackage.status}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-bold">
            ₹{currentPackage.totalYearlyPrice.toLocaleString()}
          </span>
          <span className="text-2xl text-blue-100">/year</span>
        </div>

        {currentPackage.activatedAt && (
          <div className="flex items-center gap-2 text-blue-100">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              Activated on {new Date(currentPackage.activatedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Included Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Included Modules</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentPackage.modules?.length || 0} modules active
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {currentPackage.modules?.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-750"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {module.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ₹{module.yearlyPrice.toLocaleString()}/yr
                </span>
              </div>
            )) || (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                No modules configured
              </p>
            )}
          </div>
        </motion.div>

        {/* Package Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Package Limits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current usage limits
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {currentPackage.limits?.map((limit, index) => {
              const icon =
                limit.limitType.name.toLowerCase().includes('user') ? Users :
                limit.limitType.name.toLowerCase().includes('storage') ? HardDrive :
                Settings

              const Icon = icon

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {limit.limitType.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {limit.limitValue} {limit.limitType.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: '45%' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Used: 45% of limit
                  </p>
                </div>
              )
            }) || (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                No limits configured
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Billing Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Billing Information</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Payment and invoice history
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Billing Date</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              **** **** **** 1234
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Auto-Renewal</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                Enabled
              </span>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Disable
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <a
          href="/pricing"
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
        >
          <ArrowUpRight className="h-5 w-5" />
          Upgrade Package
        </a>
        <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
          <CreditCard className="h-5 w-5" />
          Update Payment Method
        </button>
      </motion.div>
    </div>
  )
}
