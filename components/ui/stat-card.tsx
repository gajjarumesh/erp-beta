'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo'
  delay?: number
}

const colorStyles = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
}

const bgStyles = {
  blue: 'bg-blue-50 dark:bg-blue-900/20',
  green: 'bg-green-50 dark:bg-green-900/20',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
  red: 'bg-red-50 dark:bg-red-900/20',
  purple: 'bg-purple-50 dark:bg-purple-900/20',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
}

const iconStyles = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
  purple: 'text-purple-600 dark:text-purple-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'blue',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px -12px rgba(0, 0, 0, 0.1)' }}
      className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-shadow dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Gradient accent */}
      <div
        className={cn(
          'absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl bg-gradient-to-br',
          colorStyles[color]
        )}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.1 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            {value}
          </motion.p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
          {trend && (
            <div
              className={cn(
                'inline-flex items-center text-sm font-medium',
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'rounded-xl p-3',
            bgStyles[color]
          )}
        >
          <Icon className={cn('h-6 w-6', iconStyles[color])} />
        </div>
      </div>
    </motion.div>
  )
}
