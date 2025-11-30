'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning' | 'success'
  loading?: boolean
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: 'text-blue-500',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
  },
  destructive: {
    icon: XCircle,
    iconClass: 'text-red-500',
    buttonClass: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    buttonClass: 'bg-amber-600 hover:bg-amber-700',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-500',
    buttonClass: 'bg-green-600 hover:bg-green-700',
  },
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: AlertDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800"
          >
            <div className="flex flex-col items-center text-center">
              <div className={cn('mb-4 rounded-full p-3 bg-gray-100 dark:bg-gray-700', config.iconClass)}>
                <Icon className="h-6 w-6" />
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              
              {description && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
              
              <div className="mt-6 flex w-full gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={cn(
                      'flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50',
                      config.buttonClass
                    )}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      confirmText
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
